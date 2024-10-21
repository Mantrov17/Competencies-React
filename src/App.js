import React from 'react';
import styles from './App.module.scss';
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import HardSkillsMap from "./components/HardSkillsMap/HardSkillsMap";
import SoftSkillsMap from "./components/SoftSkillsMap/SoftSkillsMap";
import { Route, Routes } from "react-router-dom";
import WorkersListPage from "./components/HelloPage/WorkersListPage";


const onClickEvent = (e) => {
    e.preventDefault();
    alert('You Clicked Me!');
}

const App = () => {
    console.log(styles);
    return (
        <div className="App">
                <Routes>
                    <Route path="/workers-list-page" element={<WorkersListPage/>}/>
                    <Route path="/profile-info/:id" element={<ProfileInfo/>}/>
                    <Route path="/hard-skills/:id" element={<HardSkillsMap/>}/>
                    <Route path="/soft-skills/:id" element={<SoftSkillsMap/>}/>
                </Routes>
        </div>
    )
}

export default App;
