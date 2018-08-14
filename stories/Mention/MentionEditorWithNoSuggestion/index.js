import React, { Component } from 'react';
import { ContentState, EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import editorStyles from './editorStyles.css';
import mentionsStyles from './mentionsStyles.css';
import mentions from './mentions';

const mentionPlugin = createMentionPlugin({
  mentions,
  entityMutability: 'IMMUTABLE',
  mentionPrefix: '@',
  supportWhitespace: true,
  theme: mentionsStyles,
});
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.avatar}
            className={theme.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>
            {mention.name}
          </div>

          <div className={theme.mentionSuggestionsEntryTitle}>
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoSuggestions = (props) => {
  const {
    onMentionSelect,
    searchValue,
    theme,
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div
        className={theme.mentionSuggestionsEntryContainer}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={() => {
          // Using a timeout to simulate making an API call or something else before adding the selection
          window.setTimeout(() => onMentionSelect({ name: searchValue }), 1000);
        }}
      >
        <div className={theme.mentionSuggestionsEntry}>
          No suggestions for &quot;{searchValue}&quot;
        </div>
      </div>
    </div>
  );
};

export default class CustomMentionEditor extends Component {

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText('Mentioning an "@name" that does not exist will render a message to indicate no suggestions. Clicking on the no suggestions message will simulate adding it.')),
    suggestions: mentions,
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div className={editorStyles.editor} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          entryComponent={Entry}
          noSuggestionsComponent={NoSuggestions}
        />
      </div>
    );
  }
}
