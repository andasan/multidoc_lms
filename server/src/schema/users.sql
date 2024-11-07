-- --------------------------------------------------------
--
-- Table structure for table `hoge_users`
--

CREATE TABLE `hoge_users` (
  `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(255) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_activation_key` varchar(255) NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT 0,
  `display_name` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`),
  KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `hoge_users`
--

INSERT INTO `hoge_users` (`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `user_activation_key`, `user_status`, `display_name`) VALUES
(1, 'jsmith2024', '5f4dcc3b5aa765d61d8327deb882cf99', 'john_smith', 'john.smith@example.com', '', '2024-01-15 09:30:00', '', 0, 'John Smith'),
(2, 'emma_davis', '5f4dcc3b5aa765d61d8327deb882cf99', 'emma_davis', 'emma.davis@example.com', '', '2024-02-01 10:15:00', '', 0, 'Emma Davis'),
(3, 'michael_wong', '5f4dcc3b5aa765d61d8327deb882cf99', 'michael_wong', 'm.wong@example.com', '', '2024-02-15 08:45:00', '', 0, 'Michael Wong'),
(4, 'sarah_chen', '5f4dcc3b5aa765d61d8327deb882cf99', 'sarah_chen', 's.chen@example.com', '', '2024-02-20 11:30:00', '', 0, 'Sarah Chen'),
(5, 'raj_patel', '5f4dcc3b5aa765d61d8327deb882cf99', 'raj_patel', 'r.patel@example.com', '', '2024-02-25 14:20:00', '', 0, 'Raj Patel'),
(6, 'lisa_anderson', '5f4dcc3b5aa765d61d8327deb882cf99', 'lisa_anderson', 'l.anderson@example.com', '', '2024-03-01 09:15:00', '', 0, 'Lisa Anderson'),
(7, 'carlos_rodriguez', '5f4dcc3b5aa765d61d8327deb882cf99', 'carlos_rodriguez', 'c.rodriguez@example.com', '', '2024-03-05 13:45:00', '', 0, 'Carlos Rodriguez'),
(8, 'anna_kowalski', '5f4dcc3b5aa765d61d8327deb882cf99', 'anna_kowalski', 'a.kowalski@example.com', '', '2024-03-10 10:20:00', '', 0, 'Anna Kowalski'),
(9, 'david_kim', '5f4dcc3b5aa765d61d8327deb882cf99', 'david_kim', 'd.kim@example.com', '', '2024-03-15 15:30:00', '', 0, 'David Kim'),
(10, 'sophie_martin', '5f4dcc3b5aa765d61d8327deb882cf99', 'sophie_martin', 's.martin@example.com', '', '2024-03-20 08:45:00', '', 0, 'Sophie Martin');