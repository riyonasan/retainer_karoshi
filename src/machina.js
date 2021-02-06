const MachinaFFXIV = require('node-machina-ffxiv');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const relativeTime = require('dayjs/plugin/relativeTime');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/ja');


// dayjs.locale('ja');
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(LocalizedFormat);

(()=> {
    const Machina = new MachinaFFXIV({
        monitorType: "WinPCap",
        useSocketFilter: true
    });
    Machina.start(() => {
        console.log("Machina started!");
    });

    // Assign event handlers
    Machina.on('retainerInformation', (content) => { // Using a supertype event to streamline code
        if(!content.name) return;
        const now = new dayjs();
        const { name, ventureID, ventureComplete } = content;
        const lastCompletedTime = dayjs.unix(ventureComplete);
        const returnTime = dayjs.duration(lastCompletedTime.diff(now)).humanize(true);
        console.log(`Name: ${name}
        VentureID: ${ventureID}
        VentureCompleteTime: ${returnTime}
---------------------------------------`);
    });
})();