📢 Don't fork this project. Use, contribute, or open issues through [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Mega menu

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

VTEX Mega Menu provides an administrative app that allows to manage a custom category tree of up to 3 levels which can be used as the main navigation menu, it is implemented in the store using a set of components.

![mega-menu-app](https://user-images.githubusercontent.com/12108601/121273428-e140db00-c88d-11eb-850c-02399b803d18.png)

## Configuration

### Step 1 - Installing the Mega Menu app

Using your terminal, log in to the desired VTEX account and run the following command:

`vtex install vtex.mega-menu@0.x`

### Step 2 - Defining the category tree to be used as a menu

In the account's admin dashboard, access `STORE SETUP > Mega Menu` and using the available options configure the category tree according to your needs:

![mega-menu-admin-app](https://user-images.githubusercontent.com/12108601/121273542-18af8780-c88e-11eb-8b08-c59af2c653a0.png)

### Step 3 - Implementing the app's blocks in your store theme

Once the app is configured, it is time to place the following blocks in your Store Theme app.

Import the mega menu app to your dependencies as `manifest.json`, for example:

```json
"dependencies": {
	"vtex.mega-menu": "0.x"
}
```

### `mega-menu`

This block is responsible for querying the previously built category tree and displaying it in the store.

| Prop name               | Type     | Description                                                                                                                                                           | Default value                                                                                                                                              |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title                   | `String` | Title for the first level elements (departments) used in the mobile version or when the `orientation` is `vertical`.                                                  | Departments                                                                                                                                                |
| `orientation`           | `String` | Type of menu to be built. Possible values are horizontal and `vertical`                                                                                               | A value is determined depending on the resolution of the device, if it is a mobile (phone and tablet) it is used `vertical` and for the rest `horizontal`. |
| defaultDepartmentActive | `String` | You can use this property to determine a department that will be shown when first displaying the menu, this is useful if you want to highlight a specific department. | 🚫                                                                                                                                                         |

### `mega-menu-trigger-btn`

This block renders an icon that will be used as a trigger to open the **desktop** menu or when the `orientation` is `horizontal`.

_Note: Currently, this block receives the same props as an VTEX Store [Icon](https://github.com/vtex-apps/store-icons#props)._

### `mega-menu-go-back-btn`

This block can go back to the list of items in the first level of the menu (departments) only works when it is a **mobile device** or the `orientation` is `vertical`.

_To configure the desktop version:_

```json
{
  // ...

  "sticky-layout#4-desktop": {
    "children": ["flex-layout.row#4-desktop", "flex-layout.row#mega-menu"]
  },
  "flex-layout.row#4-desktop": {
    "children": [
      "flex-layout.col#trigger-mega-menu"
      // ...
    ]
  },

  "flex-layout.row#mega-menu": {
    "children": ["mega-menu"]
  },
  "flex-layout.col#trigger-mega-menu": {
    "props": {
      "verticalAlign": "middle"
    },
    "children": ["mega-menu-trigger-btn"]
  }
}
```

_To configure the mobile version:_

```json
{
  // ...

  "drawer": {
    "children": ["mega-menu"],
    "blocks": ["drawer-header#my-drawer"]
  },
  "mega-menu": {
    "props": {
      "defaultDepartmentActive": "Tecnología"
    }
  },
  "drawer-header#my-drawer": {
    "children": ["flex-layout.row#drawer-header"]
  },
  "flex-layout.row#drawer-header": {
    "children": [
      "flex-layout.col#mega-menu-go-back-btn",
      "flex-layout.col#spacer",
      "flex-layout.col#drawer-close-button"
    ],
    "props": {
      "blockClass": "drawer-header",
      "preventHorizontalStretch": true,
      "preventVerticalStretch": true,
      "preserveLayoutOnMobile": true,
      "fullWidth": true
    }
  },
  "flex-layout.col#drawer-close-button": {
    "children": ["drawer-close-button"],
    "props": {
      "verticalAlign": "middle",
      "horizontalAlign": "right"
    }
  },
  "flex-layout.col#mega-menu-go-back-btn": {
    "children": ["mega-menu-go-back-btn"],
    "props": {
      "verticalAlign": "middle",
      "horizontalAlign": "left",
      "paddingLeft": 4
    }
  }
}
```

### Customization

In order to apply CSS customizations on this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handle                        |
| --------------------------------- |
| `goBackContainer`                 |
| `goBackButton`                    |
| `goBackButtonIcon`                |
| `goBackButtonText`                |
| `menuContainer`                   |
| `menuContainerNav`                |
| `menuItem`                        |
| `submenuContainer`                |
| `styledLink`                      |
| `styledLinkIcon`                  |
| `styledLinkContainer`             |
| `styledLinkContent`               |
| `accordionIconContainer`          |
| `accordionIconContainer—isOpen`   |
| `accordionIconContainer—isClosed` |
| `accordionIcon`                   |
| `submenuContainer`                |
| `submenuList`                     |
| `submenuListVertical`             |
| `submenuItem`                     |
| `submenuItem—isOpen`              |
| `submenuItem—isClosed`            |
| `submenuItemVertical`             |
| `collapsibleContent`              |
| `collapsibleHeaderText`           |
| `seeAllLinkContainer`             |
| `seeAllLink`                      |
| `triggerContainer`                |
| `triggerButtonIcon`               |
| `triggerButtonIcon—active`        |
| `triggerButtonIcon—muted`         |
| `menuContainerVertical`           |
| `departmentsContainer`            |
| `menuContainerNavVertical`        |
| `menuItemVertical`                |
| `submenuContainerVertical`        |

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
