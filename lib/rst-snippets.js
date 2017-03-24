'use babel';

import RstSnippetsView from './rst-snippets-view';
import { CompositeDisposable } from 'atom';
import { TableCommand, FlowtableCommand } from './tables';
import Headers from './headings';

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
      'rst-snippets:h1': () => this.h1(),
      'rst-snippets:h2': () => this.h2(),
      'rst-snippets:h3': () => this.h3(),
      'rst-snippets:h4': () => this.h4(),
      'rst-snippets:h5': () => this.h5(),
      'rst-snippets:h6': () => this.h6(),
      'rst-snippets:h7': () => this.h7(),
      'rst-snippets:h8': () => this.h8(),
      'rst-snippets:h9': () => this.h9(),
      'rst-snippets:h10': () => this.h10(),
      'rst-snippets:h11': () => this.h11(),
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
  },

  h1() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H1(editor);
      cmd.run();
    }
  },

  h2() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H2(editor);
      cmd.run();
    }
  },

  h3() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H3(editor);
      cmd.run();
    }
  },

  h4() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H4(editor);
      cmd.run();
    }
  },

  h5() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H5(editor);
      cmd.run();
    }
  },
  h6() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H6(editor);
      cmd.run();
    }
  },
  h7() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H7(editor);
      cmd.run();
    }
  },
  h8() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H8(editor);
      cmd.run();
    }
  },
  h9() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H9(editor);
      cmd.run();
    }
  },
  h10() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H10(editor);
      cmd.run();
    }
  },
  h11() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cmd = new Headers.H11(editor);
      cmd.run();
    }
  }
};
