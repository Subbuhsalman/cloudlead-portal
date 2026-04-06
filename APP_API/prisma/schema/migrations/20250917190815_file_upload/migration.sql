-- CreateTable
CREATE TABLE `file_uploads` (
    `file_upload_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `original_filename` VARCHAR(191) NOT NULL,
    `file_path` LONGTEXT NOT NULL,
    `file_url` LONGTEXT NULL,
    `file_size` INTEGER NOT NULL,
    `file_type` ENUM('PDF', 'DOCX', 'TXT', 'XLSX', 'CSV', 'OTHER') NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `status` ENUM('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'UPLOADED',
    `admin_notes` TEXT NULL,
    `processed_file_path` LONGTEXT NULL,
    `processed_file_url` LONGTEXT NULL,
    `processed_by` INTEGER NULL,
    `processed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`file_upload_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_processed_by_fkey` FOREIGN KEY (`processed_by`) REFERENCES `admin_user`(`admin_user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
