/* eslint-disable */

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeflex/primeflex.css';
import './App.css'
import './styles/spaces.css'
import './styles/fonts.css'
import { AutoComplete } from "primereact/autocomplete";
import { Card } from 'primereact/card';

function App() {
  
  

  return (
    <div className="bg-hero w-full h-full">

      <div className="title p-1px">
        <h1 className="text-center text-white mt-200px ">Build stronger digital connections</h1>
        <p className="text-center text-white text-xl font-normal font-helvetica mx-auto w-8 mt-5">Use our URL shortener to engage your audience and connect them to the right information.</p>
       
        <Card
             title="Shorten a long link"
              className="w-10 m-6"
    >
        <p className="long-url font-semibold mb-2">Paste your long link here</p>
        <AutoComplete  field="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Hint: type 'a'" />

        </Card>

      </div>
        
      
    </div>
  )
}

export default App
