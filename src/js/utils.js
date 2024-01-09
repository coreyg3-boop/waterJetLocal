import * as fileHandler from './fileHandler.js';

const menuNavigation = () => {
    const linkButton = document.querySelectorAll('button.goToPage');

    linkButton.forEach((button) => {
      button.addEventListener('click', () => {
        const link = button.dataset.href;
        pageChangeFade();
        setTimeout(() => {
            window.location.href = link
        }, 125);
      });
    });
  };

const pageChangeFade = () => {
    const bodyMainContent = document.querySelector('body > main section.content');
    
    if (bodyMainContent.classList.contains('fade-in')) {
        bodyMainContent.classList.remove('fade-in');
        bodyMainContent.classList.add('fade-out');
    } else if (bodyMainContent.classList.contains('fade-out')) {
        bodyMainContent.classList.remove('fade-out');
        bodyMainContent.classList.add('fade-in');
    } else {
        bodyMainContent.classList.add('fade-in');
    }
}

const driveLetterSpecification = (driveLetter) => {
  if (!window.localStorage.getItem('specifiedDriveLetter')) {
    window.localStorage.setItem('specifiedDriveLetter', 'Z:');
  } else {
    window.localStorage.setItem('specifiedDriveLetter', driveLetter + ':');
  }

  console.log(window.localStorage.getItem('specifiedDriveLetter'));
}

const projectToMove = (project) => {
  let newStatus;
  const currentStatus = project.status;

  switch (project.status) {
    case 'pending':
      newStatus = 'inProgress';
      break;
    case 'inProgress':
      newStatus = 'completed';
      break;
    case 'completed':
      newStatus = 'archived';
      break;
    default:
      newStatus = 'pending';
  }

  project.status = newStatus;

  console.log(project);

  fileHandler.addProjectToLocal(project);
  fileHandler.removeProjectFromLocal(project, currentStatus);
}

const moveToNewStatus = (thisCard, status) => {
  const cardID = thisCard.dataset.id;
  const projects = JSON.parse(window.sessionStorage.getItem(status));

  projects.forEach((project) => {
    if(project['id'] === cardID) {
      projectToMove(project);
    }
  })

  // for(let projectArr in projects) {
  //   projects[projectArr].forEach((project) => {
  //     if(project['id'] === cardID) {
  //       projectToMove(project);
  //     }
  //   });
  // }

}

const makeCard = (project) => {
  const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = project.id;
  const status = project.status;

  const button = document.createElement('button');
    button.classList.add('move-status-button');
    button.classList.add('button');
    button.classList.add('is-info');
    button.textContent = "Move To In Progress";
    button.addEventListener('click', (event) => {
      console.log(event);
      console.log(event.target.parentElement);

      const thisCard = event.target.parentElement;
      //!!!//---dbStuff.updateStatus(thisCard.dataset.id, 'pending');
      moveToNewStatus(thisCard, status);
      thisCard.remove();
    });

  // const cardContent = `<div class="card-content">
  //                 <p class="client">${project.client_name}</p>
  //                 <p class="project">${project.project_name}</p>
  //                 <p class="status">${project.status}</p>
  //                 <p class="details-button">Show Details</p>
  //                 <div class="details-panel">
  //                 <p><span>${project.thickness} </span><span>${project.unit} - </span><span>${project.material}</span></p>
  //                 <p>Quantity: ${project.quantity}</p>
  //                 <hr/>
  //                 <p>${
  //                   (function() {
  //                     const projectProcedures = project.procedures.split(',');
  //                     let projectProcedureSpans = '';
  //                     projectProcedures.forEach((item, index) => {
  //                       projectProcedureSpans += '<span class="project-procedure" data-procedure-name="' + item + '">' + item + '</span><br/>'
  //                     });
  //                     return projectProcedureSpans;
  //                   })()
  //                 }</p>
  //                 <hr/>
  //                 <p>Comments: ${project.comments}</p>
  //                 <hr/>
  //                 <p>${
  //                   (function() {
  //                     const projectFiles = project.files.split(',');
  //                     let projectFileSpans = '';
  //                     projectFiles.forEach((item, index) => {
  //                       projectFileSpans += '<span class="project-file" data-file-name="' + item + '">' + item + '</span><br/>'
  //                     });
  //                     return projectFileSpans;
  //                   })()
  //                 }</p>
  //                 <button class="preview-files">Preview Filess</button>
  //                 <br/>
  //                 <br/>
  //                 <hr/>
  //                 <p><input name="revise" id="revise" type="checkbox"><label for="revise">Revise Project</label></p>
  //                 </div>
  //                 </div>`;

  const cardContent = `<div class="card-content">
                  <p class="client">${project.client_name}</p>
                  <p class="project">${project.project_name}</p>
                  <p class="status">${project.status}</p>
                  <p class="details-button">Show Details</p>
                  <div class="details-panel">
                  <p><span>${project.thickness} </span><span>${project.unit} - </span><span>${project.material}</span></p>
                  <p>Quantity: ${project.quantity}</p>
                  <hr/>
            
                  <hr/>
                  <p>Comments: ${project.comments}</p>
                  <hr/>
                
                  <button class="preview-files">Preview Filess</button>
                  <br/>
                  <br/>
                  <hr/>
                  <p><input name="revise" id="revise" type="checkbox"><label for="revise">Revise Project</label></p>
                  </div>
                  </div>`;

  card.insertAdjacentHTML("beforeend", cardContent);

  const fileNames = card.querySelectorAll('span.project-file');
  const detailsButton = card.querySelector('p.details-button');
  const previewFilesButton = card.querySelector('preview-files');
  const details = card.querySelector('div.details-panel');
  const svgElem = document.querySelector('#svg');
  const svgToImg = document.querySelector('.svg-to-img');
  const revise = card.querySelector('#revise');

  revise.addEventListener('change', function(e) {
    if (e.target.checked) {
      showProjectModal(card, project);
    } else {
      console.log('naqdda');
    }
  })

  if(previewFilesButton) {
    previewFilesButton.addEventListener('click', function(e) {
      if (e.target.hasAttribute('active')) {
        console.log('modal active');
      } else {
        e.target.setAttribute('active');
        showPreviewModal(card, project);
      }
    })
  }

  detailsButton.addEventListener('click', function(evt) {
    let show;
    (evt.target.textContent.includes('Show')) ? show = false : show = true;
    const act = show ? 'Show' : 'Hide'
    evt.target.textContent = act + " Details";
    evt.target.classList.toggle('hidden');
    details.classList.toggle('visible');
    if (details.style.maxHeight) {
      details.style.maxHeight = null;
    } else {
      details.style.maxHeight = details.scrollHeight + "px";
    } 
  });

  fileNames.forEach((fileName) => {
    const cadView = document.getElementById('cad-view');
    const dxfContent = document.getElementById('dxf-content');
    console.log(cadView)
    fileName.addEventListener('click', function() {
      const filePath = 'X:\\waterjetDashboard\\pending\\' + project.client_name + '\\' + project.project_name + '\\' +fileName.dataset.fileName;
      //!!!//---dbStuff.dxfHandle(filePath, project.files, cadView, dxfContent);
      //!!!//---dbStuff.dxfImgPreview(filePath, svgElem, svgToImg, content);
      //shell.openPath('X:\\waterjetDashboard\\pending\\' + project.client_name + '\\' + project.project_name + '\\' +fileName.dataset.fileName);
      // dialog.showOpenDialog(mainWindow, {
      //   properties: ['openFile', 'openDirectory']
      // })
      // ipcMain.handle("showDialog", (e, message) => {
      //   dialog.showMessageBox(mainWindow, { message });
      // });
    })
  })

  card.appendChild(button);
  //content.appendChild(card);
  return card
}

export { menuNavigation, pageChangeFade, driveLetterSpecification, makeCard }