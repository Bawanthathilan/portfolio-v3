import React from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import { RiTwitterXFill } from 'react-icons/ri';
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className="py-5 px-5 bg-secondary  dark:bg-darkBg">
      <div className="footer_contents flex justify-between">
        <h3 className="font-md text-textPrimary font-medium">
          &copy; {new Date().getFullYear()} Bawantha Thilan
        </h3>
        <div className=" flex flex-row gap-5 items-center ">
          <div className="social-links  gap-5 flex">
            <Link
              aria-label="twitter"
              href="https://twitter.com/ThilanBawantha"
              target="_blank"
            >
              <RiTwitterXFill className="text-textPrimary text-2xl" />
            </Link>
            <Link
              aria-label="github"
              href="https://github.com/Bawanthathilan"
              target="_blank"
            >
              <AiOutlineGithub className="text-textPrimary text-2xl" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
