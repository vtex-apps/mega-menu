📢 Don't fork this project. Use, contribute, or open issues through [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Mega Menu

[<i class="fa-brands fa-github"></i> Source code](https://github.com/vtex-apps/mega-menu)

> ⚠️ This app is no longer maintained by VTEX. This means support and maintenance are no longer provided.

The Mega Menu app provides a way to create and manage the custom menu up to three levels in the category tree. The stores can use this app as the main navigation menu.

![mega-menu-app](https://user-images.githubusercontent.com/12108601/121273428-e140db00-c88d-11eb-850c-02399b803d18.png)

## Configuration

### Step 1 - Installing the Mega Menu app

Using your terminal, log in to the desired VTEX account and run the following command:

`vtex install vtex.mega-menu@2.x`

### Step 2 - Define the category tree to be used as a menu in the admin

In the account's admin dashboard, access `STORE SETUP > Mega Menu` and using the available options, configure the category tree according to your needs:

![mega-menu-admin-app](https://user-images.githubusercontent.com/8409481/185652487-8ca70f56-59f8-440c-b173-ad65a1763686.png)

### Step 3 - Implementing the app's blocks in your store theme

> ⚠️ If you have installed this app previously, please validate with your block settings and add the new components to modify the orientation Menu. No change the option to vertical Menu if you haven't yet configured this in your store.

Once the app is configured, place the following blocks in your Store Theme app.

Import the mega menu app to your dependencies as `manifest.json`, for example:

```json
"dependencies": {
	"vtex.mega-menu": "2.x"
}
```

### `mega-menu`

This block is responsible for querying the previously built category tree and displaying it in the store.

| Prop name               | Type     | Description                                                                                                                                                           | Default value                                                                                                                                              |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title                   | `String` | Title for the first-level elements (departments) used in the mobile version or when the `orientation` is `vertical`.                                                  | Departments                                                                                                                                                |
| `orientation`           | `String` | Type of menu to be built. Possible values are horizontal and `vertical`                                                                                               | A value is determined depending on the resolution of the device, if it is a mobile (phone and tablet) it is used `vertical` and for the rest `horizontal`. |
| defaultDepartmentActive | `String` | You can use this property to specify the department shown when the menu is first displayed. This is useful if you want to highlight a specific department. | 🚫                                                                                                                                                         |
| openOnly                | `String` | Define the orientation of the menu. You can choose between vertical and horizontal. | `horizontal`                                                                                     |

### `mega-menu-trigger-btn`

This block renders an icon that serves as a trigger to open the **desktop** menu when the `orientation` is `horizontal` or `vertical`.

> This block receives the same `props` as a VTEX Store [Icon](https://github.com/vtex-apps/store-icons#props).

### `mega-menu-go-back-btn`

This block can go back to the list of items at the first level of the menu (departments) only when it is a **mobile device** or the `orientation` is `vertical`.

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
    "children": ["mega-menu#desktop"]
  },
  "mega-menu#desktop": {
    "props": {
      "openOnly": "horizontal"
    }
  },
  "flex-layout.col#trigger-mega-menu": {
    "props": {
      "verticalAlign": "middle"
    },
    "children": ["mega-menu-trigger-btn"]
  },
  "mega-menu-trigger-btn": {
    "props": {
      "Drawer": "drawer"
    }
  }
}
```

_To configure the mobile version:_

```json
{
  // ...
  "flex-layout.row#1-mobile": {
    "children": [
      "flex-layout.col#trigger-mega-menu"
      // ...
    ],
    "props": {
      // ...
    }
  },

  "drawer": {
    "children": ["mega-menu#mobile"],
    "blocks": ["drawer-header#my-drawer"]
  },
  "mega-menu#mobile": {
    "props": {
      "defaultDepartmentActive": "...",
      "orientation": "vertical",
      "openOnly": "vertical"
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

## Notes

### Icons for menu items

In the form of creation and edition of a menu item it is possible to add an icon, currently you can select any of the [ICONPACK](https://github.com/vtex-apps/store-icons/blob/master/styles/iconpacks/iconpack.svg) that comes default with your store, but if you have customized (for more information read the following [guide](https://github.com/vtex-apps/store-icons/blob/master/docs/ICONPACK.md)) that file the modifications will not be visible in the select, therefore you must write the id of the icon manually.

![icon-selector](https://user-images.githubusercontent.com/12108601/122150424-5595f400-ce23-11eb-9f1e-c52c668c35f4.png)

### Styles for menu items

You can customize an element in a basic way using **comma (,)** separated CSS properties, for example:

> ⚠️ It is important not to abuse this functionality, for complex personalizations use [CSS Handle](#customization).

```
padding-top:5px,
padding-left:20px,
padding-right:20px,
padding-bottom:5px,
font-size:20px,
font-weight:bold,
background-color:yellow,
color:red
```

![custom-item-using-css](https://user-images.githubusercontent.com/12108601/122150523-8118de80-ce23-11eb-80af-182be8348db5.png)

## Customization

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

### Upload mega menu data from CSV file

To upload data from a CSV file, you should create an import file with the following structure. The data will then be successfully stored in VBASE.

![11](https://user-images.githubusercontent.com/8409481/152260407-8f5220d3-9522-41a9-b974-08915240985e.png)

The field `subMenus` is a String with the following structure:

`[{ "id":"submenu1383316", "name":"submenu1", "icon":"","slug":"Menu1/submenu1", "styles":"","display":true, "enableSty":true,"order":1, "slugRoot":"submenu1", "slugRelative":"Menu1", "menu":[{ "id":"sub-tercernivel-menu12121", "name":"sub-tercernivel-menu1-3", "icon":"", "slug":"Menu1/submenu1/menu1-3", "styles":"", "display":true, "enableSty":true, "order":1, "slugRoot":"menu1-3", "slugRelative":"Menu1/submenu1"}] }]`

![12](https://user-images.githubusercontent.com/8409481/152260595-0ba50600-52f3-42db-b754-85b794c4e567.png)

You can add the rows that you want. Remember to keep the structure defined previously in all data.

![13](https://user-images.githubusercontent.com/8409481/152260652-732fbeda-1d61-49ce-afa1-6a19b8d9b05c.png)

Save the file. You can choose any name for the file. Then go to the admin and select the “upload data” option.

![14](https://user-images.githubusercontent.com/8409481/152260742-6ee24d1f-48ae-4383-ab02-b3d921a283e4.png)

To generate backup data, download the information from the “Download CSV” button.

![15](https://user-images.githubusercontent.com/8409481/152260800-7ecc499a-ba39-4168-8dcd-c0b225f610db.png)

![16](https://user-images.githubusercontent.com/8409481/152260876-07321655-a4ca-43eb-9c92-974ff8f9b12b.png)

This button is only available if the mega menu has data to save. The download file has the same structure defined at the beginning of this step.
