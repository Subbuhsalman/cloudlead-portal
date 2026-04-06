import { prisma } from "../../config/dbConnection";

class FileUploadRepository {
  async create(fileData: any) {
    const file = await prisma.fileUpload.create({
      data: {
        user_id: fileData.user_id,
        original_filename: fileData.original_filename,
        file_path: fileData.file_path,
        file_url: fileData.file_url,
        file_size: fileData.file_size,
        file_type: fileData.file_type,
        mime_type: fileData.mime_type,
        status: fileData.status || 'UPLOADED'
      },
      include: {
        User: {
          select: {
            user_id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return file;
  }

  async getUserFiles(userId: number, page = 1, per_page = 10) {
    const offset = (page - 1) * per_page;
    
    const [files, totalCount] = await Promise.all([
      prisma.fileUpload.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: per_page,
        include: {
          ProcessedBy: {
            select: {
              admin_user_id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.fileUpload.count({
        where: { user_id: userId }
      })
    ]);

    return {
      files,
      pagination: {
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / per_page),
        currentPage: page,
        per_page
      }
    };
  }

  async getById(fileId: number) {
    return await prisma.fileUpload.findUnique({
      where: { file_upload_id: fileId },
      include: {
        User: {
          select: {
            user_id: true,
            name: true,
            email: true
          }
        },
        ProcessedBy: {
          select: {
            admin_user_id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async updateStatus(fileId: number, status: string, updateData?: any) {
    const data: any = { status };
    
    if (updateData) {
      if (updateData.admin_notes) data.admin_notes = updateData.admin_notes;
      if (updateData.processed_file_path) data.processed_file_path = updateData.processed_file_path;
      if (updateData.processed_file_url) data.processed_file_url = updateData.processed_file_url;
      if (updateData.processed_by) data.processed_by = updateData.processed_by;
      if (status === 'COMPLETED') data.processed_at = new Date();
    }

    return await prisma.fileUpload.update({
      where: { file_upload_id: fileId },
      data,
      include: {
        User: {
          select: {
            user_id: true,
            name: true,
            email: true
          }
        },
        ProcessedBy: {
          select: {
            admin_user_id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getAllPendingFiles(page = 1, per_page = 10) {
    const offset = (page - 1) * per_page;
    
    const [files, totalCount] = await Promise.all([
      prisma.fileUpload.findMany({
        where: { 
          status: {
            in: ['UPLOADED', 'PROCESSING']
          }
        },
        orderBy: { created_at: 'asc' },
        skip: offset,
        take: per_page,
        include: {
          User: {
            select: {
              user_id: true,
              name: true,
              email: true
            }
          },
          ProcessedBy: {
            select: {
              admin_user_id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.fileUpload.count({
        where: { 
          status: {
            in: ['UPLOADED', 'PROCESSING']
          }
        }
      })
    ]);

    return {
      files,
      pagination: {
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / per_page),
        currentPage: page,
        per_page
      }
    };
  }

  async delete(fileId: number) {
    return await prisma.fileUpload.delete({
      where: { file_upload_id: fileId }
    });
  }
}

export default FileUploadRepository;
