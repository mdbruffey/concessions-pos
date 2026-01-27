import { useState } from "react";
import styles from "./styles/ReportsWindow.module.css";
import POSButton from "./POSButton";
import SessionReportModal from "./reports/SessionReportModal";
import {timestampToSessionDate} from "../utils.js";

export default function ReportsWindow() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessionView, setSessionView] = useState<Session|null>(null);

    function getSessions() {
        window.electron.getSessions().then((sessions) => setSessions(sessions));
    }

    getSessions();

    return (
        <div className={styles.main}>
            <h2>Reports</h2>
            {sessionView && <SessionReportModal session={sessionView} close={() => setSessionView(null)}/>}
            <div className={styles.sectionContainer}>
                <div className={styles.sessionList}>
                    {sessions.length &&
                        sessions.map((s, i) => {
                            let string = timestampToSessionDate(s.start);
                            return <POSButton label={string} key={i} onClick={() => setSessionView(s)}/>;
                        })}
                </div>
            </div>
        </div>
    );
}
