import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {connectLogger, createCtx} from '@reatom/framework'
import {reatomContext} from '@reatom/npm-react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import EditorPage from './view/pages/EditorPage/EditorPage'


const ctx = createCtx()
connectLogger(ctx)

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
)

root.render(
	<React.StrictMode>
		<reatomContext.Provider value={ctx}>
			<BrowserRouter>
				<Routes>
					<Route path={'/'} element={<EditorPage/>}></Route>
				</Routes>
			</BrowserRouter>
		</reatomContext.Provider>
	</React.StrictMode>,
)