/*
 * Projects Store
 */
import storage from 'electron-json-storage';
import LogState from '../../utils/projects/log-state'
import environmentStatus from '../../utils/environments/status'
import initializationState from '../../utils/environments/initialization-state'
import projectDefaults from '../../utils/projects/defaults'

function createProjectRuntimeState(project) {
  Object.assign(project, {
    runtime: {
      status: environmentStatus.OFFLINE,
      serverLog: null,
      applicationLog: null,
      phpErrorLog: null
    }
  })
}

function generateEncryptionKey() {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 1; i <= 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export default {
  state: {
    loading: true,
    projectsMap: {
      // Keep this for reference
      // 1: {
      //       _id: 1,
      //       _rev: '1-A6157A5EA545C99B00FF904EEF05FD9F',
      //       name: 'Amazon Store',
      //       starred: true,
      //       environmentType: 'pond',
      //       location: '/Users/alexeybobkov/October/pond/test-projects/acme/amazon',
      //       client: 'ACME client',

      //       runtime: {
      //           status: environmentStatus.OFFLINE,
      //           serverLog: new LogState(),
      //           applicationLog: new LogState(),
      //           phpErrorLog: new LogState()
      //       }
      //   }
    },
    selectedProject: null,
    newProject: {}
  },
  actions: {
    loadProjects({ commit }) {
      return new Promise((resolve, reject) => {
          storage.get('projects', (error, data) => {
            if (error) {
              reject(error)
            }
            else {
              commit('SET_PROJECTS', data)
              resolve(data)
            }
          });
      });
    },
    setSelectedProject({ commit }, payload) {
      commit('SET_SELECTED_PROJECT', payload)
    },
    toggleProjectStar({ commit }, project) {
      commit('SET_STARRED', {
        project: project,
        starred: !project.starred
      })
    },
    startServer({ commit }, project) {
      commit('SET_PROJECT_STATUS', {
        projectId: project._id,
        status: environmentStatus.STARTING
      })

      environments.get(project).start()
    },
    stopServer({ commit }, project) {
      commit('SET_PROJECT_STATUS', {
        projectId: project._id,
        status: environmentStatus.STARTING
      })

      environments.get(project).stop()
    },
    setProjectStatus({ commit }, payload) {
      commit('SET_PROJECT_STATUS', payload)
    },
    logServerEvent({ commit }, payload) {
      commit('LOG_SERVER_EVENT', payload)
    },
    addProject({ commit }, payload) {
      commit('ADD_PROJECT', payload)
    },
    initNewProjectState({ commit }, payload) {
      commit('INIT_NEW_PROJECT_STATE', payload)
    }
  },
  mutations: {
    // Important TODO: the project deletion mutation
    // must trigger deletion of the environment object,
    // if is initialized in the memory. This should
    // remove all event listeners inside the environment
    // and nullify internal references.

    SET_PROJECTS(state, projects) {
      Object.values(projects).forEach(project => createProjectRuntimeState(project))

      state.projectsMap = projects
      state.loading = false
    },
    SET_SELECTED_PROJECT(state, payload) {
      if (!payload.project.runtime.serverLog) {
        payload.project.runtime.serverLog = new LogState()
        payload.project.runtime.applicationLog = new LogState()
        payload.project.runtime.phpErrorLog = new LogState()
      }

      state.selectedProject = payload.project
    },
    SET_STARRED(state, payload) {
      payload.project.starred = payload.starred
    },
    SET_PROJECT_STATUS(state, payload) {
      const project = findProjectById(state, payload.projectId)

      if (project) {
        project.runtime.status = payload.status
      }
    },
    LOG_SERVER_EVENT(state, payload) {
      const project = findProjectById(state, payload.projectId)

      if (project) {
        project.runtime.serverLog.addLine(payload.message)
      }
    },
    ADD_PROJECT(state, project) {
      createProjectRuntimeState(project)
      let clone = _.cloneDeep(state.projectsMap)
      clone[project.id] = project

      state.projectsMap = clone
    },
    INIT_NEW_PROJECT_STATE(state, payload)
    {
      // All non-configuration parameters should be
      // defined in the `runtime` property. All parameters
      // except `runtime` are used as the project coniguration
      // and passed directly to the Configuration Agent.
      //
      state.newProject =  {
        name: '',
        environmentType: 'pond',
        location: '',
        client: '',
        description: '',
        localPort: null,
        useAdvancedOptions: false,
        runtime: {
          initState: new initializationState.Tracker(),
          warnings: null
        }
      }

      Object.assign(state.newProject, projectDefaults.advancedOptions)

      state.newProject.encryptionKey = generateEncryptionKey()

      if (payload && payload.isDemo) {
        state.newProject.name = 'October CMS Demo'
        state.newProject.client = 'Demo client'
        state.newProject.description = 'My first October CMS project!'
      }
    },
    UPDATE_NEW_PROJECT(state, payload) {
      state.newProject = payload;
    }
  },
  getters: {
    projects(state) {
      return Object.values(state.projectsMap)
    },
    newProject(state) {
      return state.newProject
    }
  },
}