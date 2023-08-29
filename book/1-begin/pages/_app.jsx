import App from 'next/app';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

// import Header from '../components/Header';
import dynamic from 'next/dynamic';
import { theme } from '../lib/theme';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        const Header = dynamic(import('../components/Header'), { ssr: false });

        return (
            <CacheProvider value={createCache({ key: 'css' })}>
                <ThemeProvider theme={theme}>
                    <Head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </Head>
                    <CssBaseline />
                    <Header {...pageProps} />
                    <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
        );
    }
}

const propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

MyApp.propTypes = propTypes;

export default MyApp;
