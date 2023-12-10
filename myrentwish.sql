-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2023 at 12:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myrentwish`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `about` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`id`, `firstname`, `lastname`, `email`, `username`, `password`, `contact`, `about`, `address`, `image`, `imagePath`, `date`) VALUES
(1, 'Kilvish', 'Ciss', 'vasubirla007@gmail.com', 'admin', '123456', '1234567890', 'CISS Invoice Management System can be a robust and useful addition, allowing administrators to manage users, invoices, and other essential functions. Below are some key features and considerations for your admin panel:', 'Sai Ram Plaza, 210, Mangal Nagar Road', 'img_tonystark.jpg_1701862871820.jpg', 'public\\uploads\\img_tonystark.jpg_1701862871820.jpg', '2023-08-14 12:15:42.000000');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_faq`
--

CREATE TABLE `tbl_faq` (
  `faq_id` int(11) NOT NULL,
  `faq` text NOT NULL,
  `answer` text NOT NULL,
  `faq_type` enum('landlord','tenant') NOT NULL DEFAULT 'tenant',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_faq`
--

INSERT INTO `tbl_faq` (`faq_id`, `faq`, `answer`, `faq_type`, `created_at`) VALUES
(62, 'How to rent my room ? ', 'sfdsdffs', 'tenant', '2023-12-10 11:48:10');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fcm`
--

CREATE TABLE `tbl_fcm` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `device_status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fcm`
--

INSERT INTO `tbl_fcm` (`id`, `user_id`, `device_token`, `device_status`, `created_at`, `updated_at`) VALUES
(1, 8, 'f0CYFFO1Q7yM7-odkColEz:APA91bHefpuwb-YK0rUXOIxf0H_rQta6sEkNv1ja1XCnKw5MSTbbGw4vKOlWzB1samIyQuzpTtpLayfeIry6W3rNhKI20jwDnvrwN3dN57-OhvWvX7Nkoc_Bn5B1yQxwp7UZr-h-txjW', 'Android', '2023-12-06 07:23:51', '2023-12-06 07:23:51'),
(2, 12, 'vvv', 'android', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_interest`
--

CREATE TABLE `tbl_interest` (
  `interest_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `prop_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_prefer`
--

CREATE TABLE `tbl_prefer` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `prefered_gender` varchar(255) NOT NULL,
  `prefered_city` varchar(255) NOT NULL,
  `prefered_country` varchar(255) NOT NULL,
  `bedroom_nums` varchar(255) NOT NULL,
  `bathroom_type` varchar(255) NOT NULL,
  `parking_type` varchar(255) NOT NULL,
  `prefered_rent` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_prop`
--

CREATE TABLE `tbl_prop` (
  `prop_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `owner_contact` varchar(20) DEFAULT NULL,
  `owner_email` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `prop_type` varchar(50) DEFAULT NULL,
  `bedroom_nums` varchar(255) DEFAULT NULL,
  `bathroom_type` enum('Shared','Private') DEFAULT NULL,
  `parking_type` enum('Dedicated','Shared','Available','Not Available') DEFAULT NULL,
  `size_sqft` varchar(255) DEFAULT NULL,
  `rent_amount` varchar(255) DEFAULT NULL,
  `available_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_available` varchar(255) DEFAULT 'true',
  `prop_status` enum('available','rented') DEFAULT 'available',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_prop`
--

INSERT INTO `tbl_prop` (`prop_id`, `user_id`, `owner_name`, `owner_contact`, `owner_email`, `title`, `description`, `address`, `city`, `country`, `prop_type`, `bedroom_nums`, `bathroom_type`, `parking_type`, `size_sqft`, `rent_amount`, `available_date`, `is_available`, `prop_status`, `images`, `created_at`, `updated_at`) VALUES
(1, 8, 'Kilvish', '9039568219', 'kilvishbirla@gmal.com', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701416919081.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701416919100.jpg\"}]', '2023-12-01 07:48:39', '2023-12-06 13:53:47'),
(3, 8, 'Kilvish', '9039568219', 'kilvishbirla@gmal.com', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', '1', 'rented', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701417946319.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701417946336.jpg\"}]', '2023-12-01 08:05:46', '2023-12-06 13:53:52'),
(5, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', '1', 'rented', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_472613970.jpg_1701419430686.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_images.jpg_1701419430688.jpg\"}]', '2023-12-01 08:30:30', '2023-12-06 13:53:55'),
(6, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '4BHK', 'Very good 4BHK', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_female5.jpeg_1701432210023.jpeg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_female6.jpeg_1701432210024.jpeg\"}]', '2023-12-01 08:31:47', '2023-12-06 11:20:35'),
(7, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '3BHK', 'very Stylish Moder Age 3BHK villa ', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000', '200', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_1.jpg_1701502945996.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_11.jpg_1701502946017.jpg\"}]', '2023-12-02 07:42:26', '2023-12-06 11:20:38'),
(10, 26, 'User26', '9039568219', 'user26@gmail.com', '3BHK', 'Banglow', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000', '200', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_472613970.jpg_1701935698979.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_images.jpg_1701935698982.jpg\"}]', '2023-12-07 07:54:59', '2023-12-07 07:54:59');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_proptype`
--

CREATE TABLE `tbl_proptype` (
  `id` int(11) NOT NULL,
  `prop_type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_proptype`
--

INSERT INTO `tbl_proptype` (`id`, `prop_type`, `created_at`) VALUES
(2, 'Home', '2023-12-05 12:17:12'),
(4, 'Room', '2023-12-06 06:21:59'),
(7, 'Villa', '2023-12-07 11:31:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_questions`
--

CREATE TABLE `tbl_questions` (
  `question_id` int(11) NOT NULL,
  `question_text` varchar(255) NOT NULL,
  `question_type` enum('options_2','options_3','dropdown') NOT NULL,
  `answer_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answer_options`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_questions`
--

INSERT INTO `tbl_questions` (`question_id`, `question_text`, `question_type`, `answer_options`) VALUES
(1, 'what is your fvt color ?', 'options_2', '[\"yellow\",\"green\"]'),
(2, 'which is your fvt Game?', 'options_3', '[\"Cricket\",\"Football\",\"Hockey\"]'),
(3, 'which is your places ?', 'dropdown', '[\"Indore\",\"Bhopal\",\"Goa\",\"USA\",\"England\",\"Itly\",\"Mumbai\"]'),
(5, 'What is your Prefered Gender ? ', 'options_2', '[\"male\",\"female\"]'),
(6, 'With whom do you want to Live ? ', 'options_2', '[\"male \",\"female\"]'),
(7, 'jsdkfjsdf', 'options_2', '[\"sfd\",\"sdfd\"]'),
(8, 'sdfsdfsd', 'options_2', '[\"sfsdf\",\"sdfsdfsd\"]'),
(9, ' Quest 8', 'options_2', '[\"sfsd\",\"sfsdf\"]'),
(10, ' Quest 9 ', 'options_3', '[\"sfsdf\",\"sdfsdf\",\"sfdf\"]'),
(11, ' Quest 11', 'dropdown', '[\"sfd\",\"sfdsfsd\",\"ssdfsfd\",\"sfsfd\",\"sfsdf\"]'),
(12, ' Quest 13', 'options_2', '[\"sfsdf\",\"sdfsdf\"]'),
(13, ' Quest 14', 'options_2', '[\"ssd\",\"sfsdf\"]'),
(14, ' Quest 15', 'options_2', '[\"sfsdf\",\"ssdf\"]'),
(15, ' Quest 16', 'options_2', '[\"sdfds\",\"sfsdf\"]'),
(16, ' Quest 17', 'options_2', '[\"sdfsd\",\"ssfd\"]'),
(17, ' Quest 18', 'options_2', '[\"sdfsd\",\"sdfsdf\"]'),
(18, ' Quest 19', 'dropdown', '[\"sfsdf\",\"sdfsd\",\"sfsdf\",\"sfsdf\"]'),
(19, ' Quest 20', 'options_3', '[\"sdfds\",\"sfsd\",\"sfsd\"]'),
(20, ' Quest 21', 'options_2', '[\"sdfsdf\",\"sdfsdfds\"]'),
(21, 'Question 21 ', 'options_2', '[\"mahen\",\"netaji\"]');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_register`
--

CREATE TABLE `tbl_register` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_register`
--

INSERT INTO `tbl_register` (`user_id`, `name`, `email`, `birthday`, `password`) VALUES
(1, 'kilvish', 'kil@gmail.com', '25-03-1991', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_skills`
--

CREATE TABLE `tbl_skills` (
  `id` int(11) NOT NULL,
  `skill` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_skills`
--

INSERT INTO `tbl_skills` (`id`, `skill`, `created_at`) VALUES
(1, 'House work', '2023-12-07 12:29:29'),
(2, 'Education / Learning', '2023-12-07 13:06:25'),
(3, 'Physical Assistance', '2023-12-07 13:06:33'),
(4, 'Transportation', '2023-12-07 13:06:55'),
(5, 'Pet / Animal Care', '2023-12-07 13:06:58'),
(6, 'Elder cafe', '2023-12-07 13:07:09'),
(7, 'Cooking', '2023-12-07 13:07:18'),
(8, 'Child care', '2023-12-07 13:07:21'),
(9, 'Ground Work', '2023-12-07 13:07:25'),
(10, 'Championship', '2023-12-07 13:07:36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_mobile` varchar(15) DEFAULT NULL,
  `birthday` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT 'notDetected',
  `latitude` varchar(255) NOT NULL DEFAULT 'notDetected',
  `longitude` varchar(255) NOT NULL DEFAULT 'notDetected',
  `address` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `prefered_gender` varchar(255) NOT NULL,
  `prefered_city` varchar(255) NOT NULL,
  `prefered_country` varchar(255) NOT NULL,
  `bedroom_nums` varchar(255) NOT NULL,
  `bathroom_type` varchar(255) NOT NULL,
  `parking_type` varchar(255) NOT NULL,
  `prefered_rent` varchar(255) NOT NULL,
  `about_me` text NOT NULL,
  `skill` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_id`, `firstname`, `lastname`, `user_email`, `password`, `user_mobile`, `birthday`, `location`, `latitude`, `longitude`, `address`, `country`, `city`, `gender`, `prefered_gender`, `prefered_city`, `prefered_country`, `bedroom_nums`, `bathroom_type`, `parking_type`, `prefered_rent`, `about_me`, `skill`, `image`, `imagePath`, `status`, `created_at`) VALUES
(8, 'Kilvish11', 'Birla', 'kilvishbirla@gmail.com', '$2a$10$jv.Gpm1HMKXAzcPOLhVnR.ns5q2/8re7lEimjfOGsFv9PHl.jxlP2', '9039568219', '25-03-1970', '', '', '', '           Sai ram plaza       ', 'India', 'Indore', 'male', 'female', 'newyork', 'USA', '1', 'Shared', 'Shared', '200', 'i am andhera ', 'House Work', 'img_batman.jpg_1701259463709.jpg', 'http://195.35.23.27:3008/uploads/img_batman.jpg_1701259463709.jpg', 'active', '2023-11-29 07:39:02'),
(9, 'Vasu', 'Birla', 'vasubirla@gmail.com', '$2a$10$LIWBfxIho8ZodGzPqrfKC.a4mxqpz392NPsl5ETI/p8tJ6Zy/Kw7i', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'inactive', '2023-11-29 12:21:41'),
(12, 'vishnu', 'prajapati', 'vishnuprajapati1@gmail.com', '$2a$10$u9O5qoBN/DfTFPRuOFsaOOqTxTG/Qzsxcpjpb/OQovJT8r/AFU00q', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', 'female', 'indore', 'India', '1', 'Shared', 'Shared', '500', 'vishnu', '', 'img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'http://195.35.23.27:3008/uploads/img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'active', '2023-11-30 06:49:19'),
(16, 'vishnu', 'prajapati', 'vishnuprajapati2@gmail.com', '$2a$10$Xssq1UKg11c6Os.ZRj8XZ.nxoWz7IgBCDPoU0TZmLtkMU6q8jHEj6', '1234567899', '24/06/2003', '', '', '', '  Sairam ram plaza  ', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-12-01 06:01:24'),
(17, 'vishnu', 'prajapati', 'vishnuprajapati3@gmail.com', '$2a$10$tKef6ypmAvLDshoKWLdaJ.H4ZoKMGNkqm7F8xB9VlA6iX2MHDCTMa', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-12-01 10:41:31'),
(26, 'user26', ' ', 'user26@gmail.com', '$2a$10$ak4u8X.1ex4JEHp3CAxvp.XZHCSdRQZecnJq2EgJUw/GUUYy5S036', '9039568219', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', 'female', 'newyork', 'Canada', '1', 'Shared', 'Shared', '300', 'i am andhera ', 'House Work', '', '', 'active', '2023-12-07 07:51:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_answers`
--

CREATE TABLE `tbl_user_answers` (
  `answer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_answers`
--

INSERT INTO `tbl_user_answers` (`answer_id`, `user_id`, `question_id`, `question`, `answer`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 'what is your fvt color ?', 'green', '2023-12-07 07:40:06', '2023-12-07 07:45:40'),
(6, 8, 4, 'which is your fvt Game?', 'chess', '2023-12-07 07:46:09', '2023-12-07 07:46:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  ADD PRIMARY KEY (`faq_id`);

--
-- Indexes for table `tbl_fcm`
--
ALTER TABLE `tbl_fcm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_interest`
--
ALTER TABLE `tbl_interest`
  ADD PRIMARY KEY (`interest_id`),
  ADD UNIQUE KEY `unique_user_prop` (`user_id`,`prop_id`);

--
-- Indexes for table `tbl_prefer`
--
ALTER TABLE `tbl_prefer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_prop`
--
ALTER TABLE `tbl_prop`
  ADD PRIMARY KEY (`prop_id`);

--
-- Indexes for table `tbl_proptype`
--
ALTER TABLE `tbl_proptype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `tbl_register`
--
ALTER TABLE `tbl_register`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tbl_user_answers`
--
ALTER TABLE `tbl_user_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD UNIQUE KEY `unique_user_question` (`user_id`,`question_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  MODIFY `faq_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `tbl_fcm`
--
ALTER TABLE `tbl_fcm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_interest`
--
ALTER TABLE `tbl_interest`
  MODIFY `interest_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_prefer`
--
ALTER TABLE `tbl_prefer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_prop`
--
ALTER TABLE `tbl_prop`
  MODIFY `prop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_proptype`
--
ALTER TABLE `tbl_proptype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `tbl_register`
--
ALTER TABLE `tbl_register`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `tbl_user_answers`
--
ALTER TABLE `tbl_user_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
