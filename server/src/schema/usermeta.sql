-- --------------------------------------------------------

--
-- Table structure for table `hoge_usermeta`
--

CREATE TABLE `hoge_usermeta` (
  `umeta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext DEFAULT NULL,
  PRIMARY KEY (`umeta_id`),
  KEY `user_id` (`user_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `hoge_usermeta`
--

INSERT INTO `hoge_usermeta` (`umeta_id`, `user_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'wp_capabilities', 'a:2:{s:13:\"administrator\";b:1;s:16:\"tutor_instructor\";b:1;}'),
(2, 2, 'wp_capabilities', 'a:1:{s:13:\"subscriber\";b:1;}'),
(3, 3, 'wp_capabilities', 'a:1:{s:13:\"subscriber\";b:1;}'),
(4, 4, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(5, 5, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(6, 6, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(7, 7, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(8, 8, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(9, 9, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}'),
(10, 10, 'wp_capabilities', 'a:1:{s:10:\"subscriber\";b:1;}');

--
-- Indexes for table `hoge_usermeta`
--
ALTER TABLE `hoge_usermeta`
  ADD PRIMARY KEY (`umeta_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meta_key` (`meta_key`(191));
