-- CreateTable
CREATE TABLE `admin_user` (
    `admin_user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` VARCHAR(191) NOT NULL DEFAULT 'NO',
    `password` VARCHAR(191) NOT NULL,
    `is_active` VARCHAR(191) NOT NULL DEFAULT 'YES',
    `last_loggedin` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_user_email_key`(`email`),
    PRIMARY KEY (`admin_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `coupon_id` INTEGER NOT NULL AUTO_INCREMENT,
    `coupon_title` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `discount_type` ENUM('PERCENTAGE', 'FLAT') NOT NULL,
    `discount_value` DOUBLE NOT NULL,
    `usage_limit` INTEGER NULL,
    `used_count` INTEGER NOT NULL DEFAULT 0,
    `user_limit` INTEGER NULL,
    `expiration_date` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_coupons` (
    `order_coupon_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `coupon_id` INTEGER NOT NULL,
    `discount_amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_rates` (
    `tax_rate_id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `tax_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`tax_rate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platform_settings` (
    `platform_setting_id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`platform_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `order_id` INTEGER NULL,
    `vendor_membership_id` INTEGER NULL,
    `transaction_identifier` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `amount` DOUBLE NULL,
    `type` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `payment_intent_id` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` VARCHAR(191) NOT NULL DEFAULT 'NO',
    `phone_number_verified` VARCHAR(191) NOT NULL DEFAULT 'NO',
    `password` VARCHAR(255) NOT NULL,
    `profile_picture` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `user_stripe_account_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_otp_guid_key`(`guid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_wallet` (
    `user_wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0.0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_wallet_user_id_key`(`user_id`),
    PRIMARY KEY (`user_wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_address` (
    `user_address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `address_type` ENUM('office', 'home', 'work') NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `lat` VARCHAR(191) NOT NULL,
    `lon` VARCHAR(191) NOT NULL,
    `meta_data` JSON NULL,
    `is_default` VARCHAR(191) NOT NULL DEFAULT 'NO',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `vendor_id` INTEGER NOT NULL,
    `sub_total` DOUBLE NOT NULL,
    `delivery_fee` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `is_scheduled` VARCHAR(191) NULL DEFAULT 'NO',
    `delivery_day` VARCHAR(191) NULL,
    `delivery_time` VARCHAR(191) NULL,
    `delivery_address` VARCHAR(191) NULL,
    `delivery_latitude` DECIMAL(65, 30) NULL,
    `delivery_longitude` DECIMAL(65, 30) NULL,
    `delivery_instruction` TEXT NULL,
    `payment_method_id` VARCHAR(191) NULL,
    `order_tip` DOUBLE NULL DEFAULT 0.00,
    `total_amount` DOUBLE NOT NULL,
    `paid_with` VARCHAR(191) NOT NULL,
    `order_status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_withdrawal_method` (
    `payment_withdrawal_method` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `payment_type` ENUM('BANK', 'CREDIT_CARD') NOT NULL,
    `meta_data` JSON NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`payment_withdrawal_method`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_fcm_token` (
    `user_fcm_token_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `device` VARCHAR(191) NULL,
    `token` LONGTEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_fcm_token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `billing_cycle` ENUM('monthly', 'yearly') NOT NULL,
    `credits_included` INTEGER NOT NULL,
    `stripe_price_id` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pricing_plans_stripe_price_id_key`(`stripe_price_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `credit_cost` INTEGER NOT NULL DEFAULT 1,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `feature_id` INTEGER NOT NULL,
    `included_usage` INTEGER NULL,

    UNIQUE INDEX `plan_feature_plan_id_feature_id_key`(`plan_id`, `feature_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `plan_id` INTEGER NOT NULL,
    `stripe_subscription_id` VARCHAR(100) NULL,
    `status` ENUM('active', 'canceled', 'expired', 'past_due') NOT NULL DEFAULT 'active',
    `current_period_start` DATETIME(3) NOT NULL,
    `current_period_end` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_subscription_stripe_subscription_id_key`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_credit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `subscription_id` INTEGER NOT NULL,
    `total_credits` INTEGER NOT NULL,
    `used_credits` INTEGER NOT NULL DEFAULT 0,
    `remaining_credits` INTEGER NOT NULL DEFAULT 0,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_credit_user_id_idx`(`user_id`),
    INDEX `user_credit_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_usage_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `credit_id` INTEGER NOT NULL,
    `feature_id` INTEGER NOT NULL,
    `credits_used` INTEGER NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `credit_usage_log_user_id_idx`(`user_id`),
    INDEX `credit_usage_log_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `subscription_id` INTEGER NOT NULL,
    `stripe_payment_intent_id` VARCHAR(100) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `status` ENUM('pending', 'succeeded', 'failed', 'canceled') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payment_history_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_coupons` ADD CONSTRAINT `order_coupons_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_coupons` ADD CONSTRAINT `order_coupons_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_otp` ADD CONSTRAINT `user_otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_wallet` ADD CONSTRAINT `user_wallet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_address` ADD CONSTRAINT `user_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_withdrawal_method` ADD CONSTRAINT `payment_withdrawal_method_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_fcm_token` ADD CONSTRAINT `user_fcm_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_feature` ADD CONSTRAINT `plan_feature_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_feature` ADD CONSTRAINT `plan_feature_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `feature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription` ADD CONSTRAINT `user_subscription_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `pricing_plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription` ADD CONSTRAINT `user_subscription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_credit` ADD CONSTRAINT `user_credit_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `user_subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_credit` ADD CONSTRAINT `user_credit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_usage_log` ADD CONSTRAINT `credit_usage_log_credit_id_fkey` FOREIGN KEY (`credit_id`) REFERENCES `user_credit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_usage_log` ADD CONSTRAINT `credit_usage_log_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_usage_log` ADD CONSTRAINT `credit_usage_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_history` ADD CONSTRAINT `payment_history_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `user_subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_history` ADD CONSTRAINT `payment_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
