import FileUploadRepository from './FileUploadRepository';
import { smtpConfig } from '../../config/configs';
import SendEmail from '../../services/Mail/EmailSend';
import { prisma } from '../../config/dbConnection';

class FileUploadService {
  private repository: FileUploadRepository;

  constructor() {
    this.repository = new FileUploadRepository();
  }

  async createFileUpload(fileData: any) {
    try {
      return await this.repository.create(fileData);
    } catch (error) {
      console.error('FileUploadService.createFileUpload error:', error);
      throw error;
    }
  }

  async getUserFiles(userId: number, page = 1, per_page = 10) {
    try {
      return await this.repository.getUserFiles(userId, page, per_page);
    } catch (error) {
      console.error('FileUploadService.getUserFiles error:', error);
      throw error;
    }
  }

  async getFileById(fileId: number) {
    try {
      return await this.repository.getById(fileId);
    } catch (error) {
      console.error('FileUploadService.getFileById error:', error);
      throw error;
    }
  }

  async updateFileStatus(fileId: number, status: string, updateData?: any) {
    try {
      const updatedFile = await this.repository.updateStatus(fileId, status, updateData);
      
      // Send email notification if file is completed
      if (status === 'COMPLETED' && updatedFile.User) {
        await this.sendCompletionEmail(updatedFile);
      }
      
      return updatedFile;
    } catch (error) {
      console.error('FileUploadService.updateFileStatus error:', error);
      throw error;
    }
  }

  async getAllPendingFiles(page = 1, per_page = 10) {
    try {
      return await this.repository.getAllPendingFiles(page, per_page);
    } catch (error) {
      console.error('FileUploadService.getAllPendingFiles error:', error);
      throw error;
    }
  }

  async deleteFile(fileId: number) {
    try {
      return await this.repository.delete(fileId);
    } catch (error) {
      console.error('FileUploadService.deleteFile error:', error);
      throw error;
    }
  }

  private async sendCompletionEmail(fileData: any) {
    try {
      const mailService = new SendEmail(smtpConfig);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Your File Processing is Complete!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">✅ Processing Complete</h3>
            <p><strong>File Name:</strong> ${fileData.original_filename}</p>
            <p><strong>Processed Date:</strong> ${new Date(fileData.processed_at).toLocaleDateString()}</p>
            ${fileData.admin_notes ? `<p><strong>Admin Notes:</strong> ${fileData.admin_notes}</p>` : ''}
          </div>
          
          ${fileData.processed_file_url ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fileData.processed_file_url}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Download Processed File
              </a>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; 
                      font-size: 14px; color: #666; text-align: center;">
            <p>Thank you for using our file processing service!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      `;

      await mailService.sendEmail({
        to: fileData.User.email,
        subject: `File Processing Complete - ${fileData.original_filename}`,
        html: emailHtml
      });

      console.log(`Completion email sent to ${fileData.User.email} for file ${fileData.original_filename}`);
    } catch (error) {
      console.error('Error sending completion email:', error);
      // Don't throw error here as the main operation (updating file) should still succeed
    }
  }

  getFileTypeFromMimetype(mimetype: string): string {
    const mimeTypeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/msword': 'DOCX',
      'text/plain': 'TXT',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-excel': 'XLSX',
      'text/csv': 'CSV'
    };

    return mimeTypeMap[mimetype] || 'OTHER';
  }

  async getUserCredits(userId: number): Promise<number> {
    try {
      const credits = await prisma.userCredit.aggregate({
        where: {
          user_id: userId,
          expires_at: { gt: new Date() },
          remaining_credits: { gt: 0 }
        },
        _sum: {
          remaining_credits: true
        }
      });

      return credits._sum.remaining_credits || 0;
    } catch (error) {
      console.error('Error getting user credits:', error);
      throw new Error('Failed to get user credits');
    }
  }

  async deductCredits(userId: number, creditsToDeduct: number, description: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Get available credits (oldest first)
        const availableCredits = await tx.userCredit.findMany({
          where: {
            user_id: userId,
            expires_at: { gt: new Date() },
            remaining_credits: { gt: 0 }
          },
          orderBy: { expires_at: 'asc' }
        });

        if (availableCredits.length === 0) {
          throw new Error('No available credits');
        }

        const totalAvailable = availableCredits.reduce((sum, credit) => sum + credit.remaining_credits, 0);
        if (totalAvailable < creditsToDeduct) {
          throw new Error('Insufficient credits');
        }

        let remainingToDeduct = creditsToDeduct;

        for (const credit of availableCredits) {
          if (remainingToDeduct <= 0) break;

          const creditsFromThis = Math.min(remainingToDeduct, credit.remaining_credits);

          // Update credit usage
          await tx.userCredit.update({
            where: { id: credit.id },
            data: {
              used_credits: credit.used_credits + creditsFromThis,
              remaining_credits: credit.remaining_credits - creditsFromThis
            }
          });

          // Get or create File Upload feature
          let fileUploadFeature = await tx.feature.findFirst({
            where: { name: 'File Upload' }
          });

          if (!fileUploadFeature) {
            fileUploadFeature = await tx.feature.create({
              data: {
                name: 'File Upload',
                description: 'Upload and process CSV files',
                credit_cost: 1,
                is_active: true
              }
            });
          }

          // Log usage
          await tx.creditUsageLog.create({
            data: {
              user_id: userId,
              credit_id: credit.id,
              feature_id: fileUploadFeature.id,
              credits_used: creditsFromThis,
              description: description
            }
          });

          remainingToDeduct -= creditsFromThis;
        }
      });
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw error;
    }
  }
}

export default FileUploadService;
