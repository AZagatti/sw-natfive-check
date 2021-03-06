import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="NatFive Count made by André Zagatti"
          />
          <meta name="author" content="André Luis Zagatti Adorna" />
          <meta name="keywords" content="Summoners War, Nat5, NatFive" />
          <meta name="og:title" content="NatFive Count - Summoners War" />
          <meta
            name="og:description"
            content="NatFive Count made by André Zagatti"
          />
          <meta name="og:type" content="website" />
          <meta name="og:locale" content="pt_BR" />
          <meta name="og:url" content="https://natfive.azagatti.dev/" />
          <meta
            name="og:image"
            content="https://res.cloudinary.com/zagatti/image/upload/v1598043520/natfive-logo_bwtgzr.jpg"
          />

          <link rel="canonical" href="https://natfive.azagatti.dev/" />
          <script
            data-ad-client="ca-pub-6856691048766261"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-176080246-1"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                
                  gtag('config', 'UA-176080246-1');
              `,
            }}
          />
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}
