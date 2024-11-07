-- --------------------------------------------------------

--
-- Table structure for table `hoge_invoices`
--

CREATE TABLE `hoge_invoices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(20) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    company_info JSON NOT NULL,
    invoice_info JSON NOT NULL,
    invoice_items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES hoge_users(ID)
) ENGINE=InnoDB;
