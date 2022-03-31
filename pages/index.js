import Head from 'next/head'
import { useState, useMemo } from 'react' 
import initializeBasicAuth from 'nextjs-basic-auth'

const nsrestlet = require('nsrestlet')
const util = require('util')

const users = [
  {user: 'rejuveron', password: 'rjwgs18'}
]
const basicAuthCheck = initializeBasicAuth({
  users: users
})

var accountSettings = {
  accountId: process.env.ACCOUNT_ID,
  tokenKey: process.env.TOKEN_KEY,
  tokenSecret: process.env.TOKEN_SECRET,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET
}
var urlSettings = {
    url: process.env.URL
}
var myQL = nsrestlet.createLink(accountSettings, urlSettings)

function Vendors({ data }) {
  const [searchState, setSearchState] = useState('')

  const filteredVendors = useMemo(() => {
    if (searchState) {
      return data.filter(
        (item) =>
          item.entityid
            .toLowerCase()
            .indexOf(searchState.toLocaleLowerCase()) > -1
      )
    } 
    return data
  }, [searchState])
  
  return (
    <div className="container">
      <Head>
        <title>Rejuveron Vendor Lookup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Supplier List
        </h1>
      

        <p>Type all or part of the supplier's name check if it already exists in our database.</p>
        <input type="search" value={searchState} onChange={e => setSearchState(e.target.value)} />
        <ul>
          {filteredVendors.length > 0 ?
            (filteredVendors && filteredVendors.map(item => (
              <li key={item.id}>{item.entityid}</li>
            ))): <div>The vendor does not exist. Click <a href="https://form.typeform.com/to/Mn6hmNT0">this link</a> to request that it be added.</div>
          }
          </ul>
      </main>    

      <footer>
      <a
          href="https://otticode.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/otticode.svg" alt="Otticode" className="logo" />
        </a>
      </footer>

      <style jsx>{`
      .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: left;
          align-items: left;
        }

        main {
          padding: 1rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: left;
          align-items: left;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: blue;
          text-decoration: underline;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size
        }

        .title,
        .description {
          text-align: left;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      </div>
  )
}

// This gets called on every request
export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  await basicAuthCheck(req, res)

  const myQlPostPromise = util.promisify(myQL.post)
  const results = await myQlPostPromise({ query: 'SELECT id, entityid FROM Vendor ORDER BY entityid' })
  console.debug(results.rows)
  const data = results.rows
  
  return { props: { data } }
}

export default Vendors