import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		var userId = this.session.get('user.id');
    return this.store.find('album', {sort: 'createdAt desc', user: userId});
  },

  setupController: function (controller, album) {
    let accessToken = this.container.lookup('simple-auth-authorizer:oauth2-bearer').session.content.access_token;
    let headers = {
      Authorization: 'bearer ' + accessToken
    };
    controller.set('requestHeaders', headers);
    controller.set('model', album);
  },

  actions: {
    queuePhoto(file) {
      // Initialize a 'photos' array property on the controller
      let controller = this.controller;
      if (controller.get('photos') == null) {
        controller.set('photos', Ember.A([]));
      }

      // The following is for ember-plupload. It creates a data URI
      // which can be used in the app as an img src, for instance.
      // It then adds the current file to the controller array of photos
      file.read().then(function setPreviewUrl(dataURI) {
        file.set('preview', dataURI);
      }).then(function addFileToController(){
        controller.get('photos').pushObject(file);
      });
    },

    save(selectedAlbum) {
      let controller = this.controller;
      let photos = controller.get('photos');
      if (photos) {
        photos.forEach(function(photo) {
          photo.uploader.settings.multipart_params = {'albumId': selectedAlbum.id};
          photo.upload();
        });
      }
    },

    delete(photoFile) {
      let controller = this.controller;
      let filteredArray = controller.get('photos').rejectBy('file', photoFile.file);
      controller.set('photos', filteredArray);
    }
  }
});
