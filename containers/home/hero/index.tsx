import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CustomMarquee from '@/components/Marquee';
import Marquee from 'react-fast-marquee';
import MyImg from '@/assets/images/my.png';
import { BsSpotify } from 'react-icons/bs';
import getNowPlayingItem from '@/utils/spotify';
import { motion } from 'framer-motion';
import { FiDownloadCloud } from 'react-icons/fi';
import { Meteors } from '@/components/Meteors';
import { Badge } from '@/components/Badge';
import { skills } from '@/data/index';

const Hero = (props: any): any => {
  const [loading, setLoading] = useState<any>(true);
  const [result, setResult] = useState<any>({});

  useEffect(() => {
    Promise.all([
      getNowPlayingItem(
        props.client_id,
        props.client_secret,
        props.refresh_token
      )
    ]).then((results: any) => {
      setResult(results[0]);
      setLoading(false);
    });
  });

  return (
    <React.Fragment>
      <div className=" flex justify-center items-center my-5">
        <Badge
          text="Buy Next JS Portfolio Templates"
          url="https://www.buymeacoffee.com/bawanthathilan"
        />
      </div>

      <div className="relative mt-0 md:mt-0 lg:mt-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 grid-rows-3 gap-0 sm:gap-0 md:gap-5 lg:gap-5 grid-flow-row ">
        <motion.div
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" group border border-grey-200 dark:border-[#27272a] col-span-2 bg-secondary rounded-2xl p-8 flex flex-col gap-5 row-span-3 cursor-pointer dark:bg-darkBg relative"
        >
          <span className="absolute w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
          <span className="absolute w-px left-0 h-[40%] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
          <div className="image relative h-[450px] w-full ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ rotate: 180, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
              className="absolute top-5 left-5 z-10"
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {' '}
                <g clipPath="url(#clip0_118_208)">
                  {' '}
                  <path
                    d="M100 200C97.1048 105.262 94.738 102.91 0 100C94.738 97.1048 97.0903 94.738 100 0C102.895 94.738 105.262 97.0903 200 100C105.262 102.91 102.91 105.233 100 200Z"
                    fill="url(#paint0_linear_118_208)"
                  />{' '}
                </g>{' '}
                <defs>
                  {' '}
                  <linearGradient
                    id="paint0_linear_118_208"
                    x1="14"
                    y1="26"
                    x2="179"
                    y2="179.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    {' '}
                    <stop stopColor="#ffffff" />{' '}
                    <stop offset="1" stopColor="#F9ECFF" />{' '}
                  </linearGradient>{' '}
                  <clipPath id="clip0_118_208">
                    {' '}
                    <rect width="200" height="200" fill="white" />{' '}
                  </clipPath>{' '}
                </defs>{' '}
              </svg>
            </motion.div>
            <Image
              loading="lazy"
              src={MyImg}
              alt="my"
              placeholder="blur"
              className="rounded-2xl object-cover "
              fill
            />
          </div>

          <motion.div
            transition={{ duration: 1.5, delay: 0.2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="title mt-5"
          >
            <h1 className="text-4xl ">
              <span className="font-medium text-textSecondary titleFont">
                hey, I'm
              </span>{' '}
              <br />
              <span className="font-bold text-primary  titleFont dark:text-white">
                Bawantha Thian 👋
              </span>
            </h1>
          </motion.div>

          <hr />

          <div className="spotify flex gap-5 items-center flex-row flex-wrap"></div>

          {result?.isPlaying ? (
            <div className="flex items-start">
              <span className="inline-flex gap-2 items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                <BsSpotify className="text-[#1DB954] text-md" />

                <p className="whitespace-nowrap text-sm">Now Playing</p>
              </span>
            </div>
          ) : null}

          <div className="spotify_widget bg-[#1DB954] px-5 py-3 rounded-2xl flex items-center gap-5">
            <div className="album">
              {result?.isPlaying ? (
                <img
                  loading="lazy"
                  className="rounded-full h-8 w-8"
                  src={result?.albumImageUrl}
                  alt={result?.album}
                />
              ) : (
                <BsSpotify className="text-white text-2xl" />
              )}
            </div>
            <Marquee>
              <p className="text-white font-bold">
                {result?.isPlaying ? result.title : 'Not Listening'} -{' '}
                {result?.isPlaying ? result.artist : 'Spotify'}
              </p>
            </Marquee>
          </div>
        </motion.div>
        <motion.div
          transition={{ delay: 0.3 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-3 border border-grey-200 dark:border-[#27272a] bg-secondary rounded-2xl p-8 flex flex-col row-span-2 mt-5 sm:mt-5 md:mt-0 lg:mt-0 dark:bg-darkBg relative overflow-hidden"
        >
          <div className="dvg-group absolute -z-0 left-0 bottom-0 hidden md:flex justify-between w-full opacity-30 ">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1034_10)">
                <mask
                  id="mask0_1034_10"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                >
                  <path
                    d="M1.5 1.5H198.5V198.5H1.5V1.5Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="3"
                  />
                </mask>
                <g mask="url(#mask0_1034_10)">
                  <path
                    d="M198.5 149.379L151.5 196.379V50V48.5H150H3.62132L50.6213 1.5H198.5V50V149.379ZM61.4457 101.5L1.5 161.446V101.5H61.4457ZM98.5 198.5H39.399L98.5 139.399V198.5Z"
                    stroke="url(#paint0_linear_1034_10)"
                    strokeWidth="3"
                  />
                </g>
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_1034_10"
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4B467F" />
                  <stop offset="1" stopColor="#6558F9" />
                </linearGradient>
                <clipPath id="clip0_1034_10">
                  <rect width="200" height="200" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.52347 1.52347C27.0984 2.31261 47.6874 22.9015 48.4765 48.4765C22.9016 47.6874 2.31261 27.0985 1.52347 1.52347ZM101.523 101.523C127.098 102.313 147.687 122.902 148.477 148.477C122.902 147.687 102.313 127.098 101.523 101.523ZM101.523 198.477C102.313 172.902 122.902 152.313 148.477 151.523C147.687 177.098 127.098 197.687 101.523 198.477ZM198.477 198.477C172.902 197.687 152.313 177.098 151.523 151.523C177.098 152.313 197.687 172.902 198.477 198.477ZM198.477 101.523C197.687 127.098 177.098 147.687 151.523 148.477C152.313 122.902 172.902 102.313 198.477 101.523ZM51.5235 48.4765C52.3126 22.9015 72.9016 2.31261 98.4765 1.52347C97.6874 27.0985 77.0984 47.6874 51.5235 48.4765ZM148.477 48.4765C122.902 47.6874 102.313 27.0985 101.523 1.52347C127.098 2.31262 147.687 22.9015 148.477 48.4765ZM148.477 51.5235C147.687 77.0985 127.098 97.6874 101.523 98.4765C102.313 72.9015 122.902 52.3126 148.477 51.5235ZM51.5235 51.5235C77.0984 52.3126 97.6874 72.9015 98.4765 98.4765C72.9016 97.6874 52.3126 77.0985 51.5235 51.5235ZM1.52347 98.4765C2.31261 72.9015 22.9016 52.3126 48.4765 51.5235C47.6874 77.0985 27.0984 97.6874 1.52347 98.4765ZM48.4765 148.477C22.9016 147.687 2.31262 127.098 1.52347 101.523C27.0984 102.313 47.6874 122.902 48.4765 148.477ZM1.52347 198.477C2.31262 172.902 22.9016 152.313 48.4765 151.523C47.6874 177.098 27.0984 197.687 1.52347 198.477ZM98.4765 198.477C72.9016 197.687 52.3126 177.098 51.5235 151.523C77.0984 152.313 97.6874 172.902 98.4765 198.477ZM51.5235 148.477C52.3126 122.902 72.9016 102.313 98.4765 101.523C97.6874 127.098 77.0984 147.687 51.5235 148.477ZM151.523 48.4765C152.313 22.9015 172.902 2.31262 198.477 1.52347C197.687 27.0985 177.098 47.6874 151.523 48.4765ZM198.477 98.4765C172.902 97.6874 152.313 77.0985 151.523 51.5235C177.098 52.3126 197.687 72.9015 198.477 98.4765Z"
                stroke="url(#paint0_linear_1035_56)"
                strokeWidth="3"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1035_56"
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4B467F" />
                  <stop offset="1" stopColor="#6558F9" />
                </linearGradient>
              </defs>
            </svg>

            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1035_68)">
                <mask
                  id="mask0_1035_68"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                >
                  <path
                    d="M0.5 0.5H199.5V199.5H0.5V0.5Z"
                    fill="white"
                    stroke="white"
                  />
                </mask>
                <g mask="url(#mask0_1035_68)">
                  <path
                    d="M101.5 50V1.5H198.5V50C198.5 76.7858 176.786 98.5 150 98.5C123.214 98.5 101.5 76.7858 101.5 50ZM98.5 50V98.5H50H1.5V1.5H50C76.7858 1.5 98.5 23.2142 98.5 50ZM150 101.5H198.5V198.5H150C123.214 198.5 101.5 176.786 101.5 150V101.5H150ZM98.5 150V198.5H1.5V150C1.5 123.214 23.2142 101.5 50 101.5C76.7858 101.5 98.5 123.214 98.5 150Z"
                    stroke="url(#paint0_linear_1035_68)"
                    strokeWidth="3"
                  />
                </g>
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_1035_68"
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4B467F" />
                  <stop offset="1" stopColor="#6558F9" />
                </linearGradient>
                <clipPath id="clip0_1035_68">
                  <rect width="200" height="200" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <span className="absolute z-10 w-[40%] bottom-0 right-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
          <span className="absolute w-px left-0 h-[40%] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
          <div className="content z-10 flex flex-col gap-5  h-full justify-between ">
            <p className="text-primary font-bold text-4xl dark:text-white ">
              Software Engineer , Tech Blogger and {''}
              <span className="text-textSecondary">Traveller</span>, opensource
              enthusiast, practicing minimalist, and Pop Music in search of
              flow. Working with my hands to make magic happen on the internet.
            </p>
            <div className="btn_group flex flex-col md:flex-row lg:flex-row justify-between gap-4 md:gap-0">
              <a
                aria-label="download cv"
                href="https://drive.google.com/file/d/1gG4ECmLza1bP8AoafXs-U3otzY0rte0V/view?usp=sharing"
                target="_blank"
                className="cv  shadow-[0_10px_50px_rgba(8,_112,_184,_0.7)] bg-primary text-white font-medium flex items-center px-5 py-3 md:py-0 lg:py-0 rounded-xl gap-4 dark:bg-secondary dark:text-primary"
              >
                <FiDownloadCloud />
                Download CV
              </a>
              <div className="buyMeCofee">
                <a
                  aria-label="buy me coffee"
                  href="https://www.buymeacoffee.com/bawanthathilan"
                >
                  <img
                    loading="lazy"
                    alt="buy me coffee logo"
                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=bawanthathilan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
                  />
                </a>
              </div>
            </div>
          </div>

          <Meteors number={10} />
        </motion.div>

        <motion.div
          transition={{ delay: 0.4 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" flex md:flex bg-secondary dark:bg-darkBg relative group cursor-pointer col-span-3  rounded-2xl p-0  flex-col row-span-1 mt-5 sm:mt-5 md:mt-0 lg:mt-0 h-[300px] md:h-[300px]  lg:h-auto"
        >
          <div className="w-full flex items-start p-5">
            <h1 className=" text-xl font-medium">Tools and Tech I daily use</h1>
          </div>

          <div>
            <CustomMarquee direction="right">
              <div className="flex gap-5 last:ml-5">
                {skills.slice(0, 4).map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md border border-opacity-20 border-blue-500/40"
                  >
                    <skill.icon className="w-10 h-10 opacity-50" />
                  </div>
                ))}
              </div>
            </CustomMarquee>
            <CustomMarquee direction="left">
              <div className="flex gap-5 last:ml-5">
                {skills.slice(4, 9).map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md border border-opacity-20 border-blue-500/40 "
                  >
                    <skill.icon className="w-10 h-10 opacity-50" />
                  </div>
                ))}
              </div>
            </CustomMarquee>
          </div>
        </motion.div>
      </div>
    </React.Fragment>
  );
};

export default Hero;
