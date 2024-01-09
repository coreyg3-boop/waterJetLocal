import * as pageUtils from './utils.js';

const specifiedDriveLetter = (window.localStorage.getItem('specifiedDriveLetter')) ? window.localStorage.getItem('specifiedDriveLetter') + ':\\' : 'X:';

const getDBFileAddToLocal = (fileName) => {
    window.api.getFile(fileName, specifiedDriveLetter);

    window.api.onFileResponse((data, fileName) => {
        const dataArr = data.split('}');
        const newDataArr = [];
        const projectObjCollection = {};
        
        dataArr.forEach((item, index) => {
            if (index !== dataArr.length - 1) {
                item = item + '}';
                newDataArr.push(JSON.parse(item));
            }            
        });

        projectObjCollection[fileName] = newDataArr;

        window.sessionStorage.setItem(fileName, JSON.stringify(newDataArr));
    });
}

const watchDBFile = (fileName) => {
    window.api.watchFile(fileName, specifiedDriveLetter);

    window.api.onFileChange((path) => {
        const fileName = path.split('.')[0];
        getDBFileAddToLocal(fileName);
        console.log('file changed', path, fileName);
    });
}

const removeProjectFromLocal = (project, prevStatus) => {
    const localProjectList = JSON.parse(window.sessionStorage.getItem(prevStatus));
    const projectID = project['id'];
    let projectIndex;

    console.log(prevStatus);

    localProjectList.forEach((project, index) => {
        console.log(project);
        for(let spec in project) {
            if (project[spec] === projectID) {
                projectIndex = index;
                console.log('project to be removed => ', project);
            }
        }
    })
    
    console.log(localProjectList);

    localProjectList.splice(projectIndex, 1);

    console.log(localProjectList);

    window.sessionStorage.setItem(prevStatus, JSON.stringify(localProjectList));
}

const addProjectToLocal = (project) => {
    if (typeof(project) != 'object') {
        console.log('project is of incorrect type --> fileHandler.js @ Line 64');
    }
    const localProjectList = JSON.parse(window.sessionStorage.getItem(project['status'])) || [];
    
    localProjectList.push(project)
    
    window.sessionStorage.setItem(project['status'], JSON.stringify(localProjectList));
}

const populatePageWithLocalStorage = (dataName) => {
    const localData = window.sessionStorage;
    const projects= JSON.parse(localData.getItem(dataName));
    const cardList = document.createElement('div');
    const cardListId = 'cardList';

    cardList.setAttribute('id', cardListId);
    
    projects.forEach((project) => {
        const card = pageUtils.makeCard(project);

        cardList.appendChild(card);
    });

    return cardList;
}

export { getDBFileAddToLocal, watchDBFile, populatePageWithLocalStorage, addProjectToLocal, removeProjectFromLocal }