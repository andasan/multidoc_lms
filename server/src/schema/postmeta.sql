-- --------------------------------------------------------

--
-- Table structure for table `hoge_postmeta`
--

CREATE TABLE `hoge_postmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `hoge_postmeta`
--

INSERT INTO `hoge_postmeta` (`meta_id`, `post_id`, `meta_key`, `meta_value`) VALUES
(1, 17076, '_course_duration', 'a:3:{s:5:\"hours\";i:40;s:7:\"minutes\";i:0;s:7:\"seconds\";i:0;}'),
(2, 16948, '_course_duration', 'a:3:{s:5:\"hours\";i:50;s:7:\"minutes\";i:0;s:7:\"seconds\";i:0;}'),
(3, 17324, '_quiz_settings', 'a:9:{s:10:\"time_limit\";a:3:{s:10:\"time_value\";s:1:\"1\";s:9:\"time_type\";s:5:\"hours\";s:18:\"time_limit_seconds\";i:3600;}s:13:\"feedback_mode\";s:5:\"retry\";s:16:\"attempts_allowed\";s:1:\"2\";s:13:\"passing_grade\";s:2:\"70\";s:24:\"max_questions_for_answer\";s:2:\"50\";s:20:\"question_layout_view\";s:0:\"\";s:15:\"questions_order\";s:4:\"rand\";s:29:\"short_answer_characters_limit\";s:3:\"200\";s:34:\"open_ended_answer_characters_limit\";s:3:\"500\";}'),
(4, 17334, '_quiz_settings', 'a:9:{s:10:\"time_limit\";a:3:{s:10:\"time_value\";s:1:\"1\";s:9:\"time_type\";s:5:\"hours\";s:18:\"time_limit_seconds\";i:3600;}s:13:\"feedback_mode\";s:5:\"retry\";s:16:\"attempts_allowed\";s:1:\"2\";s:13:\"passing_grade\";s:2:\"70\";s:24:\"max_questions_for_answer\";s:2:\"50\";s:20:\"question_layout_view\";s:0:\"\";s:15:\"questions_order\";s:4:\"rand\";s:29:\"short_answer_characters_limit\";s:3:\"200\";s:34:\"open_ended_answer_characters_limit\";s:3:\"500\";}'),
(5, 17076, '_course_price', '3000.00'),
(6, 16948, '_course_price', '2500.00'),
(7, 17324, '_quiz_total_marks', '100.00'),
(8, 17334, '_quiz_total_marks', '100.00'),
(9, 17076, '_course_instructor', '3'),
(10, 16948, '_course_instructor', '5');