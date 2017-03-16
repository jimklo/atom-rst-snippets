'use babel';

import RstSnippetsView from './rst-snippets-view';
import { CompositeDisposable } from 'atom';
import { TableCommand, FlowtableCommand } from './tables';

export default {

  rstSnippetsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // this.rstSnippetsView = new RstSnippetsView(state.rstSnippetsViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.rstSnippetsView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rst-snippets:reflowTable': () => this.reflowTable(),
      'rst-snippets:table': () => this.table()
    }));
  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    // this.rstSnippetsView.destroy();
  },

  serialize() {
    return {
      // rstSnippetsViewState: this.rstSnippetsView.serialize()
    };
  },

  table() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new TableCommand(editor);
      cmd.run();
    }
  },

  reflowTable() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new FlowtableCommand(editor);
      cmd.run();
    }
  }

};
