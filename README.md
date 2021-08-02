
![Webp net-resizeimage](https://user-images.githubusercontent.com/8409481/127892715-9ba15881-84c3-4d2e-94ce-faf5d048b8fb.png)

# Mega menu

VTEX Mega Menu gives an administrative app that allows managing a custom category tree of up to 3 levels to use as the main navigation menu. Megamenu is implemented in the store using a set of components.

![Untitled](https://user-images.githubusercontent.com/8409481/127892762-b527d26c-a06e-4fd2-af3d-1030f027b5da.png)

## Configuration

### Step 1 - Installing the Mega Menu app

Using your terminal, log in to the  VTEX account desired and execute the following command:
 `vtex install vtex.mega-menu@1.x`
 
 
 ### Step 2 - Defining the category tree to be used as a menu
 
 In the account's admin dashboard, access `STORE SETUP > Mega Menu` and using the available options configure the category tree according to your needs:

![Untitled (1)](https://user-images.githubusercontent.com/8409481/127893270-4ad5e285-c6ff-4fac-ad98-b6ab5e6cfb05.png)


### Step 3 - Implementing the app's blocks in your store theme

Import the mega menu app to your dependencies as `manifest.json`, for example:

```json
"dependencies": {
	"vtex.mega-menu": "0.x"
}
```

### `mega-menu`

This block is responsible for querying the previously built category tree and displaying it in the store.

![image](https://user-images.githubusercontent.com/8409481/127893673-b8d41f6f-ce7b-4dad-b1a2-8cee69ddb760.png)

### `mega-menu-trigger-btn`

This block renders an icon that will be used as a trigger to open the **desktop** menu or when the `orientation` is `horizontal`.

*Note: Currently, this block receives the same props as an VTEX Store [Icon](https://github.com/vtex-apps/store-icons#props).*

### `mega-menu-go-back-btn`

This block can go back to the list of items in the first level of the menu (departments) only works when it is a **mobile device** or the `orientation` is `vertical`.

*To configure the desktop version:*

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

To configure the mobile version:


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

## Notes

### Icons for menu items

In the form of creation and edition of a menu item it is possible to add an icon, currently you can select any of the [ICONPACK](https://github.com/vtex-apps/store-icons/blob/master/styles/iconpacks/iconpack.svg) that comes default with your store, but if you have customized (for more information read the following [guide](https://github.com/vtex-apps/store-icons/blob/master/docs/ICONPACK.md)) that file the modifications will not be visible in the select, therefore you must write the id of the icon manually.

![Untitled (2)](https://user-images.githubusercontent.com/8409481/127894173-eec17c8d-1653-40c3-b1f2-0945fa1613d6.png)

### Styles for menu items

You can customize an element in a basic way using comma (,) separated CSS properties, for example:

⚠️ It is important not to abuse this functionality, for complex persoanlizations use [CSS Handle](https://www.notion.so/Mega-menu-55955dfdca344ce7bdbc6d97ab2bcf1d)

`padding-top:5px,
padding-left:20px,
padding-right:20px,
padding-bottom:5px,
font-size:20px,
font-weight:bold,
background-color:yellow,
color:red`


![Untitled (3)](https://user-images.githubusercontent.com/8409481/127894825-581ceb22-e045-49d3-bc47-9795dc284000.png)


### Customization

In order to apply CSS customizations on this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

[goBackContainer](https://www.notion.so/goBackContainer-60bbc158103e4e489041b621f35c01e1)

[goBackButton](https://www.notion.so/goBackButton-f99855f4527340808b7c78bba18a84e2)

[goBackButtonIcon](https://www.notion.so/goBackButtonIcon-6214c1ab25b04a8db5569ff78745774c)

[goBackButtonText](https://www.notion.so/goBackButtonText-09751d5fb3c94133b6a420fe2a32d6c7)

[menuContainer](https://www.notion.so/menuContainer-2f8e256ddd2647ccab9aeb214ddee276)

[menuContainerNav](https://www.notion.so/menuContainerNav-dbaf80689a124b94b50ae3640e0c4f36)

[menuItem](https://www.notion.so/menuItem-347d47eb67944988aea99edb9012a7de)

[submenuContainer](https://www.notion.so/submenuContainer-10157bb6e308489e999352f21344342e)

[styledLink](https://www.notion.so/styledLink-44887360c4994f1b83666e1d6b0f2fe9)

[styledLinkIcon](https://www.notion.so/styledLinkIcon-2e84405ed39a48f48e0621931234fa68)

[styledLinkContainer](https://www.notion.so/styledLinkContainer-a7f3b1c843344d04848d466cd3a181e6)

[styledLinkContent](https://www.notion.so/styledLinkContent-21e02c81b2ab4fe9a573ee3ed54b4fd9)

[accordionIconContainer](https://www.notion.so/accordionIconContainer-2f23fb42f8f0450084dcefa483c38c3b)

[accordionIconContainer—isOpen](https://www.notion.so/accordionIconContainer-isOpen-d5d646d05b464584933569a41af2cc47)

[accordionIconContainer—isClosed](https://www.notion.so/accordionIconContainer-isClosed-076eed1b4b9a43ac8e36bc2e9a1f7183)

[accordionIcon](https://www.notion.so/accordionIcon-946d33e42fc644c1a70592a916b9495d)

[submenuContainer](https://www.notion.so/submenuContainer-04b26fa63e35404ba73b5ce5818dc3cf)

[submenuList](https://www.notion.so/submenuList-35666968ea5d436388812ff9dc6b1e0b)

[submenuListVertical](https://www.notion.so/submenuListVertical-2089b4a1ee41462a8a7b4f91d49cb064)

[submenuItem](https://www.notion.so/submenuItem-c9e45ae4c7b346e091c7d520646251e7)

[submenuItem—isOpen](https://www.notion.so/submenuItem-isOpen-30bbe3da8c4b466d90fdf2422deb7f17)

[submenuItem—isClosed](https://www.notion.so/submenuItem-isClosed-2377dfd2bba943d4bb7ee681c543ddb5)

[submenuItemVertical](https://www.notion.so/submenuItemVertical-4faa3cab2cbf4a27b4bcaeaffc6d1489)

[collapsibleContent](https://www.notion.so/collapsibleContent-19eff4867a5342da89a50312e4a8773a)

[collapsibleHeaderText](https://www.notion.so/collapsibleHeaderText-47b5327aa8e54a61ada08c76e58cb97e)

[seeAllLinkContainer](https://www.notion.so/seeAllLinkContainer-f9b294c7ef694a01b72662ca42eca60f)

[seeAllLink](https://www.notion.so/seeAllLink-744a60c7de0a4e21ba468ca6fe422c08)

[triggerContainer](https://www.notion.so/triggerContainer-aa114505ddf94df285bf00a9b92903e1)

[triggerButtonIcon](https://www.notion.so/triggerButtonIcon-a3d3ee9b52a24a148bdb58c88c76e95a)

[triggerButtonIcon—active](https://www.notion.so/triggerButtonIcon-active-5afec405a8314a5bb1ecf426761a584b)

[triggerButtonIcon—muted](https://www.notion.so/triggerButtonIcon-muted-32a5857ed0304f87883668b56fe3eb52)

[menuContainerVertical](https://www.notion.so/menuContainerVertical-8d0621b14196450eb00a2be61b6f5061)

[departmentsContainer](https://www.notion.so/departmentsContainer-412dc761fa1043e886a8f43f40a458c1)

[menuContainerNavVertical](https://www.notion.so/menuContainerNavVertical-80e8f453cc974eb1a425bd91e7cbf845)

[menuItemVertical](https://www.notion.so/menuItemVertical-30fe55518266489ebdc45aa3fda4c87f)

[submenuContainerVertical](https://www.notion.so/submenuContainerVertical-4f7bd1fdd59a4cc489cd439630736263)



