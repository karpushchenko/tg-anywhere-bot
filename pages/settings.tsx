import Head from 'next/head'
import Script from 'next/script';
import { useState } from 'react';
import axios from 'axios';

const Placeholder = ({children} : { children: string}) => {
  return (<b onClick={() => {navigator.clipboard.writeText(children)}}>
    { children }
  </b>);
}

const Loader = () => <svg className="animate-spin ml-3 h-5 w-5 text-blue inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>

export default function Settings() {
  const [webhook, setWebhook] = useState('');
  const [schema, setSchema] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const getWebhook = async (userId:number) => {
    // const model = new Model;
    const user = {};

    axios.get(`/api/user?id=${userId}`)
      .then(function (user) {
        // handle success
        if (user.data) {
          if(user.data.webhook){
            setWebhook(user.data.webhook);
          }
          if(user.data.schema){
            setSchema(user.data.schema);
          }
        }
        setLoaded(true);
      })

  }
  const saveData = async (event: React.SyntheticEvent) => {
    setSaving(true);
    event.preventDefault();
    axios.post('/api/user', {
      id : userId,
      data: {
        webhook: webhook,
        schema: schema,
      }
    }).then( () => {
      setSaving(false);
    });
  }
  return (
    <>
      <Head>
        <title>Telegram Anywhere Settings</title>
        <meta name="description" content="Created by Ivan Karpushchenko" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => {
          console.log(`script loaded correctly, window.Telegram has been populated`);
          if(!window.Telegram.WebApp) return;
          const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
          setUserId(userId);
          getWebhook(userId);
        }
        }
      />
      <main>
        <div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Personal settings</h3>
                  <p className="mt-1 text-sm text-gray-600">Configure your settings here.</p>
                </div>
              </div>
              {loaded
                ? <div className="mt-5 md:col-span-2 md:mt-0">
                  <form action="#" method="POST" onSubmit={saveData}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">
                              Webhook url
                            </label>
                            <input
                              type="url"
                              name="webhook"
                              id="webhook"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={webhook}
                              onChange={e => setWebhook(e.target.value)}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="schema" className="block text-sm font-medium text-gray-700">
                              JSON body for your submission
                            </label>
                            <small>
                              Use the following placeholders to add dynamic values to your submission:
                              <div className='flex flex-col'>
                              <Placeholder>$firstName</Placeholder>
                              <Placeholder>$lastName</Placeholder>
                              <Placeholder>$MessageText</Placeholder>
                              <Placeholder>$MessageDate</Placeholder>
                              </div>
                            </small>
                            <textarea
                              name="schema"
                              id="schema"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={schema}
                              rows={10}
                              onChange={e => setSchema(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                          Save {saving && <Loader/>}
                        </button>
                          
                      </div>
                    </div>
                  </form>
                </div>
                : <div className="mt-5 md:col-span-2 md:mt-0 px-4 py-5 sm:p-6"><h1>Loading.. <Loader/></h1></div>
              }
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
