# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- Require the `storefront.mega-menu.edit` License Manager resource (product Storefront IO) on the `editMenu`, `deleteMenu` and `createMenu` mutations.

### Removed

- Ad-hoc admin VTEX ID session check on the menu mutations, replaced by the License Manager resource requirement.

## [0.2.1] - 2026-10-22

### Security

- Require an admin VTEX ID session on createMenu, editMenu and deleteMenu.

## [0.2.0] - 2021-06-11
### Added
- Customizable icons and css styles for elements

## [0.1.0] - 2021-06-09
### Added
- Initial files and logic created.
