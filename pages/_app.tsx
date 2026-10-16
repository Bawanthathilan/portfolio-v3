import React from 'react';
import '@/styles/globals.scss';
import Layout from '@/components/layout';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';

const SITE = {
  url: 'https://bawanthathilan.vercel.app',
  title: 'Bawantha Thilan — Senior Software Engineer',
  description:
    'Senior Software Engineer at OREL IT and /dev/3 OpenMRS developer. I build full-stack systems and developer tools with React, Next.js and TypeScript.',
  image: 'https://bawanthathilan.vercel.app/og.png',
  imageAlt:
    'Bawantha Thilan, Senior Software Engineer and Open Source Contributor'
};

export default function App({ Component, pageProps, session }: any) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>{SITE.title}</title>
        <meta name="title" content={SITE.title} />
        <meta name="description" content={SITE.description} />

        {/* Link previews (og.png: 1200x630, made to match the site) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bawantha Thilan" />
        <meta property="og:url" content={SITE.url} />
        <meta property="og:title" content={SITE.title} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:image" content={SITE.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={SITE.imageAlt} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ThilanBawantha" />
        <meta name="twitter:title" content={SITE.title} />
        <meta name="twitter:description" content={SITE.description} />
        <meta name="twitter:image" content={SITE.image} />
        <meta name="twitter:image:alt" content={SITE.imageAlt} />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <SessionProvider session={session}>
          <ReactQueryClientProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ReactQueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}
