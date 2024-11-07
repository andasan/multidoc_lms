-- --------------------------------------------------------

--
-- Table structure for table `hoge_posts`
--

CREATE TABLE `hoge_posts` (
  `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `post_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_date_gmt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_content` longtext NOT NULL,
  `post_title` text NOT NULL,
  `post_excerpt` text NOT NULL,
  `post_status` varchar(20) NOT NULL DEFAULT 'publish',
  `comment_status` varchar(20) NOT NULL DEFAULT 'open',
  `ping_status` varchar(20) NOT NULL DEFAULT 'open',
  `post_password` varchar(255) NOT NULL DEFAULT '',
  `post_name` varchar(200) NOT NULL DEFAULT '',
  `to_ping` text NOT NULL,
  `pinged` text NOT NULL,
  `post_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_modified_gmt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_content_filtered` longtext NOT NULL,
  `post_parent` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `guid` varchar(255) NOT NULL DEFAULT '',
  `menu_order` int(11) NOT NULL DEFAULT 0,
  `post_type` varchar(20) NOT NULL DEFAULT 'post',
  `post_mime_type` varchar(100) NOT NULL DEFAULT '',
  `comment_count` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;


--
-- Dumping data for table `hoge_posts`
--

INSERT INTO `hoge_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`) VALUES
(17324, 3, '2024-03-15 14:00:00', '2024-03-15 14:00:00', 'Final exam covering web development fundamentals including HTML, CSS, and JavaScript.', 'Final Exam | Web Development', '', 'publish', 'open', 'open', '', 'final-exam-web-development', '', '', '2024-03-15 14:00:00', '2024-03-15 14:00:00', '', 17076, 'https://example.com/quizzes/final-exam-web-development', 0, 'tutor_quiz', '', 0),
(17334, 5, '2024-03-16 09:00:00', '2024-03-16 09:00:00', 'Final exam for English for Academic Purposes covering reading, writing, and comprehension.', 'Final Exam | Academic Preparation', '', 'publish', 'open', 'open', '', 'final-exam-academic-preparation', '', '', '2024-03-16 09:00:00', '2024-03-16 09:00:00', '', 16948, 'https://example.com/quizzes/final-exam-academic-preparation', 0, 'tutor_quiz', '', 0),
(17076, 3, '2024-03-01 10:00:00', '2024-03-01 10:00:00', 'Comprehensive course covering web development fundamentals.', 'Web Development Fundamentals', '', 'publish', 'open', 'open', '', 'web-development-fundamentals', '', '', '2024-03-01 10:00:00', '2024-03-01 10:00:00', '', 0, 'https://example.com/courses/web-development-fundamentals', 0, 'course', '', 0),
(16948, 5, '2024-02-15 11:00:00', '2024-02-15 11:00:00', 'Course designed to improve academic English skills.', 'English for Academic Purposes (EAP)', '', 'publish', 'open', 'open', '', 'english-for-academic-purposes', '', '', '2024-02-15 11:00:00', '2024-02-15 11:00:00', '', 0, 'https://example.com/courses/english-for-academic-purposes', 0, 'course', '', 0);


--
-- Indexes for table `hoge_posts`
--
ALTER TABLE `hoge_posts`
  ADD KEY `post_name` (`post_name`(191)),
  ADD KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`ID`),
  ADD KEY `post_parent` (`post_parent`),
  ADD KEY `post_author` (`post_author`);
