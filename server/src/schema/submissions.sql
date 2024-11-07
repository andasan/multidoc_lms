-- --------------------------------------------------------

--
-- Table structure for table `hoge_rm_submissions`
--

CREATE TABLE `hoge_rm_submissions` (
  `submission_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT,
  `form_id` int(6) DEFAULT NULL,
  `data` text DEFAULT NULL,
  `user_email` varchar(250) DEFAULT NULL,
  `child_id` int(6) NOT NULL DEFAULT 0,
  `last_child` int(6) NOT NULL DEFAULT 0,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `submitted_on` datetime DEFAULT NULL,
  `unique_token` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `hoge_rm_submissions`
--

INSERT INTO `hoge_rm_submissions` (`submission_id`, `form_id`, `data`, `user_email`, `child_id`, `last_child`, `is_read`, `submitted_on`, `unique_token`) VALUES
(1, 2, 'a:4:{i:38;O:8:\"stdClass\":4:{s:5:\"label\";s:10:\"First Name\";s:5:\"value\";s:4:\"John\";s:4:\"type\";s:5:\"Fname\";s:4:\"meta\";N;}i:39;O:8:\"stdClass\":4:{s:5:\"label\";s:9:\"Last Name\";s:5:\"value\";s:5:\"Smith\";s:4:\"type\";s:5:\"Lname\";s:4:\"meta\";N;}i:40;O:8:\"stdClass\":4:{s:5:\"label\";s:5:\"Email\";s:5:\"value\";s:24:\"john.smith@example.com\";s:4:\"type\";s:5:\"Email\";s:4:\"meta\";N;}i:48;O:8:\"stdClass\":4:{s:5:\"label\";s:10:\"Birth Date\";s:5:\"value\";s:10:\"1995-03-20\";s:4:\"type\";s:12:\"jQueryUIDate\";s:4:\"meta\";N;}}', 'john.smith@example.com', 0, 0, 0, '2024-01-15 09:30:00', '217267705476108'),
(2, 2, 'a:4:{i:38;O:8:\"stdClass\":4:{s:5:\"label\";s:10:\"First Name\";s:5:\"value\";s:4:\"Emma\";s:4:\"type\";s:5:\"Fname\";s:4:\"meta\";N;}i:39;O:8:\"stdClass\":4:{s:5:\"label\";s:9:\"Last Name\";s:5:\"value\";s:5:\"Davis\";s:4:\"type\";s:5:\"Lname\";s:4:\"meta\";N;}i:40;O:8:\"stdClass\":4:{s:5:\"label\";s:5:\"Email\";s:5:\"value\";s:24:\"emma.davis@example.com\";s:4:\"type\";s:5:\"Email\";s:4:\"meta\";N;}i:48;O:8:\"stdClass\":4:{s:5:\"label\";s:10:\"Birth Date\";s:5:\"value\";s:10:\"1998-07-12\";s:4:\"type\";s:12:\"jQueryUIDate\";s:4:\"meta\";N;}}', 'emma.davis@example.com', 0, 0, 0, '2024-02-01 10:15:00', '217267705476109');