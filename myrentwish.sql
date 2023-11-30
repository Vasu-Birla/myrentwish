-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2023 at 07:50 AM
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
  `image` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_id`, `firstname`, `lastname`, `user_email`, `password`, `user_mobile`, `birthday`, `location`, `latitude`, `longitude`, `address`, `country`, `city`, `gender`, `prefered_gender`, `prefered_city`, `prefered_country`, `bedroom_nums`, `bathroom_type`, `parking_type`, `prefered_rent`, `image`, `imagePath`, `status`, `created_at`) VALUES
(8, 'Kilvish', 'Birla', 'kilvishbirla@gmail.com', '$2a$10$jv.Gpm1HMKXAzcPOLhVnR.ns5q2/8re7lEimjfOGsFv9PHl.jxlP2', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', 'female', 'Newyork', 'USA', '1', 'Shared', 'Shared', '200', 'img_batman.jpg_1701259463709.jpg', 'http://195.35.23.27:3008/uploads/img_batman.jpg_1701259463709.jpg', 'active', '2023-11-29 07:39:02'),
(9, 'Vasu', 'Birla', 'vasubirla@gmail.com', '$2a$10$LIWBfxIho8ZodGzPqrfKC.a4mxqpz392NPsl5ETI/p8tJ6Zy/Kw7i', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-11-29 12:21:41'),
(10, 'aaa', 'Birla', 'aaaa@gmail.com', '$2a$10$8Nm3cjZtKyB0i4rLe9d2q.sXaa2ZQmMT27hboI36nyrOdh1VcSYo.', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-11-30 06:28:29'),
(12, 'vishnu', 'prajapati', 'vishnuprajapati1@gmail.com', '$2a$10$u9O5qoBN/DfTFPRuOFsaOOqTxTG/Qzsxcpjpb/OQovJT8r/AFU00q', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'male', '', '', '', '', '', '', '', ' ', ' ', 'active', '2023-11-30 06:49:19');

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
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
