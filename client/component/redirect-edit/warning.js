/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'lib/locale';
import * as parseUrl from 'url';

/**
 * Internal dependencies
 */

import ExternalLink from 'component/external-link';

const isRegex = ( text ) => {
	if ( text.match( /[\*\\\(\)\[\]\^\$]/ ) !== null ) {
		return true;
	}

	if ( text.indexOf( '.?' ) !== -1 ) {
		return true;
	}

	return false;
};

const getWarningFromState = ( { url, regex } ) => {
	const warnings = [];

	if ( Array.isArray( url ) ) {
		return warnings;
	}

	// Anchor value
	if ( url.indexOf( '#' ) !== -1 ) {
		warnings.push(
			<ExternalLink url="https://redirection.me/support/faq/#anchor">{ __( 'Anchor values are not sent to the server and cannot be redirected.' ) }</ExternalLink>,
		);
	}

	// Server redirect
	if ( url.substr( 0, 4 ) === 'http' && url.indexOf( document.location.origin ) === -1 ) {
		warnings.push(
			<ExternalLink url="https://redirection.me/support/matching-redirects/#server">
				{ __( 'This will be converted to a server redirect for the domain {{code}}%(server)s{{/code}}.', {
					components: {
						code: <code />,
					},
					args: {
						server: parseUrl.parse( url ).hostname,
					},
				} ) }
			</ExternalLink>
		);
	}

	// Relative URL without leading slash
	if ( url.substr( 0, 4 ) !== 'http' && url.substr( 0, 1 ) !== '/' && url.length > 0 && ! regex ) {
		warnings.push( __( 'The source URL should probably start with a {{code}}/{{/code}}', {
			components: {
				code: <code />,
			},
		} ) );
	}

	// Regex without checkbox
	if ( isRegex( url ) && regex === false ) {
		warnings.push(
			<ExternalLink url="https://redirection.me/support/redirect-regular-expressions/">
				{ __( 'Remember to enable the "regex" checkbox if this is a regular expression.' ) }
			</ExternalLink>
		);
	}

	// Anchor
	if ( isRegex( url ) && url.indexOf( '^' ) === -1 && url.indexOf( '$' ) === -1 ) {
		warnings.push(
			__( 'To prevent a greedy regular expression you can use a {{code}}^{{/code}} to anchor it to the start of the URL. For example: {{code}}%(example)s{{/code}}', {
				components: {
					code: <code />,
				},
				args: {
					example: '^' + url,
				},
			} ),
		);
	}

	// Redirect everything
	if ( url === '/(.*)' || url === '^/(.*)' ) {
		warnings.push( __( 'This will redirect everything, including the login pages. Please be sure you want to do this.' ) );
	}

	return warnings;
};

export default getWarningFromState;
