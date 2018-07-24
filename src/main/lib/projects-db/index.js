class ProjectDb {
  constructor(storage) {
    this.storage = storage;
  }

  init() {
    return new Promise((resolve, reject) => {
      let self = this;

      this.storage.getAll((error, data) => {
        if (error) {
          reject(error);
        }
        else {
          if (!this.objIsEmpty(data)) {
            Object.keys(data).forEach((key) => {
              self[key] = data[key];
            });
          }
          else {
            this.config = { nextId: 1 };
            this.projects = {};
          }

          resolve();
        }
      })
    });
  }

  create(params) {
    console.log('creating project...');
    let project = {
      ...params,
      id: this.config.nextId
    };

    this.projects[this.config.nextId] = project;

    return this.setProjects(this.projects)
      .then(() => {
        this.incrementId();
        return project;
      });
  }

  update(id, params) {

  }

  delete(id) {

  }

  fetchAll() {
    this.storage.get('projects', (error, data) => {
      if (error) {
        throw error;
      }
      else {
        return data;
      }
    });
  }

  setProjects(projects) {
    return new Promise((resolve, reject) => {
      this.storage.set('projects', projects, (error) => {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      })
    });
  }

  incrementId() {
    let nextId = this.config.nextId + 1;
    this.storage.set('config', { nextId }, (error) => {
      if (error) {
        console.log('Error incrementing ID:', error);
      }
    })
  }

  objIsEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
}

export default ProjectDb;