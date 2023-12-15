-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2023 at 01:53 PM
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
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_from` varchar(255) NOT NULL,
  `user_to` varchar(255) NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `filePath` longtext NOT NULL,
  `mimetype` varchar(255) NOT NULL,
  `thumbnail` text NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  `userStatus` varchar(255) NOT NULL,
  `readStaus` varchar(255) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user_from`, `user_to`, `message`, `filename`, `filePath`, `mimetype`, `thumbnail`, `timestamp`, `userStatus`, `readStaus`) VALUES
(7, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:36 PM', 'online', 'true'),
(8, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:36 PM', 'online', 'true'),
(9, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:52 PM', 'online', 'true'),
(10, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 05:01 PM', 'online', 'false');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
