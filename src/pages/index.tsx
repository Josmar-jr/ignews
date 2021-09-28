import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { stripe } from 'services/stripe';

import { SubscribeButton } from 'components/SubscribeButton';

import styles from './home.module.scss';
import { getSession } from 'next-auth/client';

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
  };
};

const Home: NextPage<HomeProps> = ({ product }) => {
  async function ai() {
    const session = await getSession();
    console.log(session);
  }
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, Welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
          <button onClick={ai}>dale</button>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JaS8DBGc1Nb6Liujaf7tsfS', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
