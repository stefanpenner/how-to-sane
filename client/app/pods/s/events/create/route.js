import Ember from 'ember';
import DestroyNew from 'client/mixins/destroy-new-model';

export default Ember.Route.extend(DestroyNew, {
    model: function() {
        return this.store.createRecord('event');
    },
    actions: {
        createEvent: function(model) {

        	var userId = this.session.get('user.id');
            this.store.find('vendor', {user: userId} ).then(result => {
                console.log('model: ', model);
                model.set('vendor', result.get('content')[0]);
                // model.set('tags', ['lifestyle', 'health', 'tech']);
                return model.save();
            }).then(event => this.transitionTo('s.events.event', event));

        }
    }
});
