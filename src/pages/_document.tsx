/* eslint-disable react/jsx-props-no-spreading */
import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import * as React from "react";

import createEmotionCache from "styles/createEmotionCache";

const APP_NAME = "canvas";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();

    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enhanceApp: (App: any) => (props) =>
          <App emotionCache={cache} {...props} />,
      });

    const initialProps = await Document.getInitialProps(ctx);

    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags,
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />

          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='100'>🧑‍🎨</text></svg>"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
