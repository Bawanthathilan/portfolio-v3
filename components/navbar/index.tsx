"use client"
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn
} from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';
import { CiDark, CiMenuFries } from 'react-icons/ci';
import { AiOutlineClose } from 'react-icons/ai';
import { MdLightMode } from 'react-icons/md';
import { menuData } from '@/data/index';
//import styles 👇
import 'react-modern-drawer/dist/index.css';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure the component renders only after the client mounts
  }, []);

  if (!mounted) return null; 

  return (
    <nav className="px-5 md:px-0 lg:px-0 w-full py-2 mt-5 flex flex-row justify-between items-center sticky top-0 z-50 bg-white dark:bg-[#121212] bg-opacity-60 ">
      <Link href="/">
        <div className="logo">
          <span
            className={` ${
              currentTheme === 'dark' ? 'text-white' : 'text-textPrimary '
            } text-3xl font-bold`}
          >
            bɔː.wæn.θə
          </span>
        </div>
      </Link>
      <menu className="nav-links bg-white py-3 px-10 rounded-full  border border-gray-100 hidden sm:hidden md:hidden lg:block dark:bg-darkBg dark:border-gray-800 shadow-lg">
        <ul className="flex gap-5 text-textPrimary dark:text-white text-md cursor-pointer px-5 ">
          {menuData.map((item: any, index: number) => {
            const isSelected = item.name === selectedLink;
            return (
              <li key={index}>
                <Link
                  href={item.link}
                  key={index}
                  onClick={() => setSelectedLink(item.name)}
                  className=" relative"
                >
                  <span className="font-normal">
                    {item.name}
                    {isSelected ? (
                      <motion.div className="absolute -bottom-[1px] left-0 right-0 h-[1px]">
                        <svg
                          width="37"
                          height="8"
                          viewBox="0 0 37 8"
                          fill="none"
                        >
                          <motion.path
                            d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
                            stroke="#7043EC"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{
                              strokeDasharray: 84.20591735839844,
                              strokeDashoffset: 84.20591735839844
                            }}
                            animate={{
                              strokeDashoffset: 0
                            }}
                            transition={{
                              duration: 1
                            }}
                          />
                        </svg>
                      </motion.div>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </menu>

      <div className="social-links  gap-5 hidden sm:hidden md:flex ">
        <Link
          aria-label="facebook"
          href="https://facebook.com/bawanthathilan/"
          target="_blank"
        >
          <FaFacebookF className="text-textPrimary dark:text-white text-md" />
        </Link>

        <Link
          aria-label="twitter"
          href="https://twitter.com/ThilanBawantha"
          target="_blank"
        >
          <RiTwitterXFill className="text-textPrimary dark:text-white text-md" />
        </Link>

        <Link
          aria-label="instagram"
          href="https://www.instagram.com/bawwa_/"
          target="_blank"
        >
          <FaInstagram className="text-textPrimary dark:text-white text-md" />
        </Link>

        <Link
          aria-label="github"
          href="https://github.com/Bawanthathilan"
          target="_blank"
        >
          <FaGithub className="text-textPrimary dark:text-white text-md" />
        </Link>
        <Link
          aria-label="linkedin"
          href="https://www.linkedin.com/in/bawanthathilan/"
          target="_blank"
        >
          <FaLinkedinIn className="text-textPrimary dark:text-white text-md" />
        </Link>
      </div>

      <div className="theme-switcher flex gap-5">
        {currentTheme === 'dark' ? (
          <MdLightMode
            className="text-textPrimary text-2xl cursor-pointer dark:text-white"
            onClick={() => setTheme('light')}
          />
        ) : (
          <CiDark
            className="text-textPrimary text-2xl cursor-pointer dark:text-white"
            onClick={() => setTheme('dark')}
          />
        )}

        <div className="hamburger block md:block lg:hidden">
          {mobileMenuOpen ? (
            <AiOutlineClose
              className="text-textPrimary dark:text-white text-2xl cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : (
            <CiMenuFries
              className="text-textPrimary dark:text-white text-2xl cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
          )}

          {!mobileMenuOpen ? null : (
            <motion.div
              animate={{ y: 10, opacity: 1 }}
              transition={{ ease: 'easeInOut', duration: 0.2 }}
              className={`absolute top-12 right-0 px-10 py-5 rounded-md ${currentTheme === 'dark' ? 'bg-black border border-gray-500' : 'bg-white border border-gray-600'}`}
            >
              <motion.ul
                animate={{ y: 0, opacity: 1 }}
                className={`flex flex-col gap-5 ${currentTheme === 'dark' ? 'text-white' : 'text-textPrimary '} text-lg cursor-pointer px-0 mt-0`}
              >
                {menuData.map((item: any, index: number) => {
                  const isSelected = item.name === selectedLink;
                  return (
                    <Link
                      href={item.link}
                      key={index}
                      onClick={() => setSelectedLink(item.name)}
                      className=" relative"
                    >
                      <li className="font-normal">
                        {item.name}
                        {isSelected ? (
                          <motion.div className="absolute -bottom-[1px] left-0 right-0 h-[1px]">
                            <svg
                              width="37"
                              height="8"
                              viewBox="0 0 37 8"
                              fill="none"
                            >
                              <motion.path
                                d="M1 5.39971C7.48565 -1.08593 6.44837 -0.12827 8.33643 6.47992C8.34809 6.52075 11.6019 2.72875 12.3422 2.33912C13.8991 1.5197 16.6594 2.96924 18.3734 2.96924C21.665 2.96924 23.1972 1.69759 26.745 2.78921C29.7551 3.71539 32.6954 3.7794 35.8368 3.7794"
                                stroke="#7043EC"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{
                                  strokeDasharray: 84.20591735839844,
                                  strokeDashoffset: 84.20591735839844
                                }}
                                animate={{
                                  strokeDashoffset: 0
                                }}
                                transition={{
                                  duration: 1
                                }}
                              />
                            </svg>
                          </motion.div>
                        ) : null}
                      </li>
                    </Link>
                  );
                })}
              </motion.ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
