import './HomePage.css'


import Topbar from '../../components/Topbar/Topbar'
import Searchbar from '../../components/Searchbar/Searchbar'
import Quizlist from '../../components/Quizlist/Quizlist'


export default function HomePage () {
    return(
        <main className="home">
            <header className="home-header">
                <Topbar />
            </header>

            <div className="home-hero">

                <div className="hero-zone-left">
                    <h4 className='hero-top'>ГОТОВ СЫГРАТЬ?</h4>
                    <div className="hero-title"> Выбирай квиз.</div>
                    <div className="hero-title">Собирай друзей.</div>
                    <div className="hero-title gradient-text">Побеждай.</div>
                    <div className='hero-description'>
                        Один экран — много телефонов.
                        Играйте в квизы в реальном времени: ведущий запускает вопросы, 
                        а игроки отвечают со своих устройств.                        
                    </div>
                </div>

                <div className="hero-zone-right">
                    <div className="hero-metric card brd">
                        <h4 className='hero-metric-top'>20+</h4>
                        <h4 className='hero-top'>КВИЗОВ</h4>
                    </div>
                    <div className="hero-metric card brd">
                        <h4 className='hero-metric-top'>50К</h4>
                        <h4 className='hero-top'>ИГРОКОВ</h4>
                    </div>
                </div>
            </div>
            <Searchbar />
            <Quizlist />
        </main>
    )
}