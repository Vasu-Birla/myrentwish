-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2023 at 06:46 AM
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
-- Table structure for table `tbl_rentagreements`
--

CREATE TABLE `tbl_rentagreements` (
  `id` int(11) NOT NULL,
  `agreement_number` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `tenantSignStatus` varchar(20) NOT NULL DEFAULT 'false',
  `ownerSignStatus` varchar(20) NOT NULL DEFAULT 'true',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_rentagreements`
--

INSERT INTO `tbl_rentagreements` (`id`, `agreement_number`, `owner_id`, `tenant_id`, `status`, `tenantSignStatus`, `ownerSignStatus`, `created_at`) VALUES
(14, 'AG-1703655906489-7733', 12, 8, 'open', 'false', 'true', '2023-12-27 05:45:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_rentagreements`
--
ALTER TABLE `tbl_rentagreements`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_rentagreements`
--
ALTER TABLE `tbl_rentagreements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
