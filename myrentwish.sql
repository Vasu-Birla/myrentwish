-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2023 at 09:14 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

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
(1, 'Kilvish', 'Ciss', 'vasubirla007@gmail.com', 'admin', '123456', '1234567890', 'CISS Invoice Management System can be a robust and useful addition, allowing administrators to manage users, invoices, and other essential functions. Below are some key features and considerations for your admin panel:', 'Sai Ram Plaza, 210, Mangal Nagar Road', 'img_img_img_tonystark.jpg_1695896636587.jpg_1696068411932.jpg_1696233190364.jpg', 'public\\uploads\\img_img_img_tonystark.jpg_1695896636587.jpg_1696068411932.jpg_1696233190364.jpg', '2023-08-14 12:15:42.000000');

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
  `bedroom_nums` int(11) DEFAULT NULL,
  `bathroom_type` enum('Shared','Private') DEFAULT NULL,
  `parking_type` enum('Dedicated','Shared','Available','Not Available') DEFAULT NULL,
  `size_sqft` decimal(10,2) DEFAULT NULL,
  `rent_amount` decimal(10,2) DEFAULT NULL,
  `available_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_available` tinyint(1) DEFAULT 1,
  `prop_status` enum('available','rented') DEFAULT 'available',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_prop`
--

INSERT INTO `tbl_prop` (`prop_id`, `user_id`, `owner_name`, `owner_contact`, `owner_email`, `title`, `description`, `address`, `city`, `country`, `prop_type`, `bedroom_nums`, `bathroom_type`, `parking_type`, `size_sqft`, `rent_amount`, `available_date`, `is_available`, `prop_status`, `images`, `created_at`, `updated_at`) VALUES
(1, 8, 'Kilvish', 'Birla', '9039568219', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', 2, 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', 1, 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701416919081.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701416919100.jpg\"}]', '2023-12-01 07:48:39', '2023-12-01 07:48:39'),
(3, 8, 'Kilvish', 'Birla', '9039568219', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', 2, 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', 1, 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701417946319.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701417946336.jpg\"}]', '2023-12-01 08:05:46', '2023-12-01 08:05:46'),
(4, 8, 'Kilvish', 'Birla', '9039568219', '2BHK', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', 2, 'Private', 'Dedicated', '2000.00', '200.00', '2023-11-30 18:30:00', 1, 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701418241388.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701418241399.jpg\"}]', '2023-12-01 08:10:41', '2023-12-01 08:10:41');

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
(8, 'Kilvish', 'Birla', 'kilvishbirla@gmail.com', '$2a$10$jv.Gpm1HMKXAzcPOLhVnR.ns5q2/8re7lEimjfOGsFv9PHl.jxlP2', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', 'female', 'newyork', 'USA', '1', 'Shared', 'Shared', '200', 'i am andhera ', 'House Work', 'img_batman.jpg_1701259463709.jpg', 'http://195.35.23.27:3008/uploads/img_batman.jpg_1701259463709.jpg', 'active', '2023-11-29 07:39:02'),
(9, 'Vasu', 'Birla', 'vasubirla@gmail.com', '$2a$10$LIWBfxIho8ZodGzPqrfKC.a4mxqpz392NPsl5ETI/p8tJ6Zy/Kw7i', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-11-29 12:21:41'),
(10, 'aaa', 'Birla', 'aaaa@gmail.com', '$2a$10$8Nm3cjZtKyB0i4rLe9d2q.sXaa2ZQmMT27hboI36nyrOdh1VcSYo.', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-11-30 06:28:29'),
(12, 'vishnu', 'prajapati', 'vishnuprajapati1@gmail.com', '$2a$10$u9O5qoBN/DfTFPRuOFsaOOqTxTG/Qzsxcpjpb/OQovJT8r/AFU00q', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', 'female', 'indore', 'India', '1', 'Shared', 'Shared', '500', 'vishnu', '', 'img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'http://195.35.23.27:3008/uploads/img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'active', '2023-11-30 06:49:19'),
(16, 'vishnu', 'prajapati', 'vishnuprajapati2@gmail.com', '$2a$10$Xssq1UKg11c6Os.ZRj8XZ.nxoWz7IgBCDPoU0TZmLtkMU6q8jHEj6', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-12-01 06:01:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_prefer`
--
ALTER TABLE `tbl_prefer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_prop`
--
ALTER TABLE `tbl_prop`
  MODIFY `prop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
