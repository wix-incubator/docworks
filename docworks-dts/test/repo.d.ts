/**
 * The wix-crm module contains functionality for working with
 *  [your site's contacts](https://support.wix.com/en/article/about-your-contact-list)
 *  from client-side code.
 */
declare module 'wix-crm' {
    /**
     * Creates a new contact or updates an existing contact.
     */
    function createContact(contactInfo: wix_crm.ContactInfo): Promise<string>;

    /**
     * Sends a Triggered Email to the contact.
     */
    function emailContact(emailId: string, toContact: string, options?: wix_users.TriggeredEmailOptions): Promise<void>;

}

/**
 * The wix-storage module contains functionality for the persistent
 *  storage of key/value data in the site visitor's browser.
 */
declare module 'wix-storage' {
    /**
     * Used for local storage of data.
     */
    const local: wix_storage.Storage;

    /**
     * Used for memory storage of data.
     */
    const memory: wix_storage.Storage;

    /**
     * Used for session storage of data.
     */
    const session: wix_storage.Storage;

}

/**
 * The wix-users module contains functionality for working with your
 *  site's users from client-side code.
 */
declare module 'wix-users' {
    /**
     * Gets the current user viewing the site.
     */
    const currentUser: wix_users.User;

    /**
     * Logs the current user into the site using the given session token.
     */
    function applySessionToken(sessionToken: string): Promise<void>;

    /**
     * Sends a Triggered Email to the currently logged-in site member.
     */
    function emailUser(emailId: string, toUser: string, options?: wix_users.TriggeredEmailOptions): Promise<void>;

    /**
     * Logs a user in based on email and password.
     */
    function login(email: string, password: string): Promise<void>;

    /**
     * Logs the current user out of the site.
     */
    function logout(): void;

    /**
     * Sets the function that runs when a user logs in.
     */
    function onLogin(handler: wix_users.LoginHandler): void;

    /**
     * Prompts the current site visitor with a password reset.
     */
    function promptForgotPassword(language?: string): Promise<void>;

    /**
     * Prompts the current site visitor to log in as a site member.
     */
    function promptLogin(options: wix_users.LoginOptions): Promise<wix_users.User>;

    /**
     * Registers a new site member.
     */
    function register(email: string, password: string, options?: wix_users.RegistrationOptions): Promise<wix_users.RegistrationResult>;

}

declare namespace $w {
    /**
     * An icon that leads users to the shopping cart.
     */
    interface CartIcon extends $w.Element, $w.HiddenCollapsedMixin{
        /**
         * Adds multiple products to the shopping cart.
         */
        addProductsToCart(products: [$w.CartIcon.AddToCartItem]): Promise<void>;
        /**
         * Adds a product to the shopping cart.
         */
        addToCart(productID: string, quantity?: number, options?: $w.CartIcon.AddToCartOptions): Promise<void>;
    }

    namespace CartIcon {
        /**
         * An object used to pass a custom text field when adding a product to
         *  the shopping cart with options.
         */
        type AddToCartCustomTextField = {
            /**
             * Custom text field title.
             */
            title: string;
            /**
             * Custom text field value.
             */
            value: string;
        };

        /**
         * An object used when adding multiple products to the shopping cart.
         */
        type AddToCartItem = {
            /**
             * The ID of the product to add to the cart.
             */
            productID: string;
            /**
             * Custom custom
             *  text fields to use when adding the product to the cart.
             */
            options?: $w.CartIcon.AddToCartOptions;
        };

        /**
         * An object used when adding a product to the shopping cart with options.
         */
        type AddToCartOptions = {
            /**
             * Product options to use when adding the
             *  product to the cart. The object contains key:value pairs where the key is the
             *  option name and the value is the chosen option value.
             */
            choices: object;
            /**
             * Custom custom
             *  text fields to use when adding the product to the cart.
             */
            customTextField: $w.CartIcon.AddToCartCustomTextField;
        };

    }

    interface ClickableMixin {
        /**
         * Adds an event handler that runs when the element is clicked.
         */
        onClick(handler: $w.MouseEventHandler): $w.Element;
        /**
         * Adds an event handler that runs when the element is double-clicked.
         */
        onDblClick(handler: $w.MouseEventHandler): $w.Element;
    }

    interface DisabledMixin {
        /**
         * Indicates if the element is enabled or disabled.
         */
        readonly enabled: boolean;
        /**
         * Disables the element and sets its \`enabled\` property to \`false\`.
         */
        disable(): Promise<void>;
        /**
         * Enables the element and sets its \`enabled\` property to \`true\`.
         */
        enable(): Promise<void>;
    }

    /**
     * Dropdowns are used for selecting one of a number of options.
     *  They are especially useful when there are too many options to display using
     *  [radio buttons]($w.RadioButtonGroup.html). Dropdowns consist of a list
     *  of [options](#Option). Each [option](#Option) contains a label, which is
     *  what the user sees, and a value, which is what is used in code and stored in
     *  you collections.
     */
    interface Dropdown extends $w.FormElement, $w.HiddenCollapsedMixin, $w.DisabledMixin, $w.FocusMixin, $w.ClickableMixin, $w.StyleMixin, $w.RequiredMixin{
        /**
         * Sets or gets the options in a dropdown.
         */
        options: [$w.Dropdown.Option];
        /**
         * Sets or gets the dropdown's placeholder text.
         */
        placeholder: string;
        /**
         * Sets or gets the index of the selected option.
         */
        selectedIndex: number;
        /**
         * Gets an object containing information about the dropdown's styles.
         */
        readonly style: $w.Style;
        /**
         * Sets or gets an element's value.
         */
        value: string;
    }

    namespace Dropdown {
        /**
         * An object used by the \`options\` property that contains the attributes of a dropdown list item.
         */
        type Option = {
            /**
             * The value of the dropdown option. This is what you use in code and is what is stored in your collections.
             */
            value: string;
            /**
             * The label of the dropdown option. This is what a user sees.
             */
            label?: string;
        };

    }

    /**
     * Provides basic functionality for elements.
     */
    interface Element extends $w.Node, $w.ViewportMixin{
        /**
         * Indicates if an element is currently displayed.
         */
        readonly rendered: boolean;
        /**
         * Adds an event handler that runs when the mouse pointer is moved
         *  onto the element.
         */
        onMouseIn(handler: $w.MouseEventHandler): $w.Element;
        /**
         * Adds an event handler that runs when the mouse pointer is moved
         *  off of the element.
         */
        onMouseOut(handler: $w.MouseEventHandler): $w.Element;
    }

    /**
     * Provides functionality for elements that can set and lose focus.
     *
     *  The element on the page that is currently active is the element in focus.
     *  Only one element on the page can have focus at any given moment.
     *  Typically, an element exhibits a visual cue, such as a subtle outline,
     *  indicating that it is in focus. The element in focus receives keystroke
     *  events if the user causes any.
     *
     *  An element receives focus and loses focus (blurs) through user actions,
     *  such as clicking and tabbing, or programmatically, using the
     *  [focus( )](#focus) and [blur( )](#blur) functions.
     */
    interface FocusMixin {
        /**
         * Removes focus from the element.
         */
        blur(): void;
        /**
         * Places focus on the element.
         */
        focus(): void;
        /**
         * Adds an event handler that runs when the element loses focus.
         */
        onBlur(handler: $w.EventHandler): $w.Element;
        /**
         * Adds an event handler that runs when the element receives focus.
         */
        onFocus(handler: $w.EventHandler): $w.Element;
    }

    /**
     * Provides functionality related to user input elements.
     */
    interface FormElement extends $w.Element, $w.ValidatableMixin, $w.ValueMixin{
        /**
         * Sets or gets an element's value.
         */
        readonly value: any;
        /**
         * Adds an event handler that runs when an input element's value
         *  is changed.
         */
        onChange(handler: $w.EventHandler): $w.Element;
    }

    /**
     * Provides functionality for all elements that can be hidden or collapsed.
     */
    interface HiddenCollapsedMixin extends $w.HiddenMixin, $w.CollapsedMixin{
    }

    /**
     * Provides basic functionality for all Wix objects, including objects
     *  that are not [elements]($w.Element.html).
     */
    interface Node {
        /**
         * Indicates if an element appears on all pages or only on the current page.
         */
        readonly global: boolean;
        /**
         * Gets the element's ID.
         */
        readonly id: string;
        /**
         * Gets the element's parent element.
         */
        readonly parent: $w.Node;
        /**
         * Gets the element's type.
         */
        readonly type: string;
        /**
         * Scrolls the page to the element using an animation.
         */
        scrollTo(): Promise<void>;
    }

    /**
     * Provides functionality for input elements can be required to have a value.
     */
    interface RequiredMixin {
        /**
         * Sets or gets whether an input element is required to have a value.
         */
        required: boolean;
    }

    /**
     * Provides functionality for elements that can be styled.
     */
    interface StyleMixin {
        /**
         * Gets an object containing information about the element's styles.
         */
        readonly style: $w.Style;
    }

}

declare namespace wix_dataset {
    /**
     * A [dataset](wix-dataset.html) connects page elements to a set of items in a data collection.
     */
    interface Dataset {
        /**
         * Returns the current item.
         */
        getCurrentItem(): object;
        /**
         * Returns the current item's index.
         */
        getCurrentItemIndex(): number;
        /**
         * Gets the index of the dataset's current page.
         */
        getCurrentPageIndex(): number;
        /**
         * Returns the selected items.
         */
        getItems(fromIndex: number, numberOfItems: number): Promise<wix_dataset.Dataset.GetItemsResult>;
        /**
         * Gets the dataset's page size.
         */
        getPageSize(): number;
        /**
         * Returns the number of items in the dataset that match its filter criteria.
         */
        getTotalCount(): number;
        /**
         * Gets the number of pages in the dataset.
         */
        getTotalPageCount(): number;
        /**
         * Indicates if there is a next item.
         */
        hasNext(): boolean;
        /**
         * Indicates if there is a next page of data.
         */
        hasNextPage(): boolean;
        /**
         * Indicates if there is a previous item.
         */
        hasPrevious(): boolean;
        /**
         * Indicates if there is a previous page of data.
         */
        hasPreviousPage(): boolean;
        /**
         * Loads the next page of data in addition to the current data.
         */
        loadMore(): Promise<void>;
        /**
         * Loads the specified page.
         */
        loadPage(pageIndex: number): Promise<[object]>;
        /**
         * Create a new blank item.
         */
        new(): Promise<void>;
        /**
         * Saves the current item and moves to the next item.
         */
        next(): Promise<object>;
        /**
         * Moves to the next page of data.
         */
        nextPage(): Promise<[object]>;
        /**
         * Adds an event handler that runs just after a save.
         */
        onAfterSave(handler: wix_dataset.Dataset.AfterSaveHandler): void;
        /**
         * Adds an event handler that runs just before a save.
         */
        onBeforeSave(handler: wix_dataset.Dataset.BeforeSaveHandler): void;
        /**
         * Adds an event handler that runs when the current index changes.
         */
        onCurrentIndexChanged(handler: wix_dataset.Dataset.CurrentIndexChangedHandler): void;
        /**
         * Adds an event handler that runs when an error occurs.
         */
        onError(handler: wix_dataset.Dataset.ErrorHandler): void;
        /**
         * Adds an event handler that runs when a value of the current item changes.
         */
        onItemValuesChanged(handler: wix_dataset.Dataset.ItemValuesChangedHandler): void;
        /**
         * Adds an event handler that runs when the dataset is ready.
         */
        onReady(handler: wix_dataset.Dataset.ReadyHandler): void;
        /**
         * Saves the current item and moves to the previous item.
         */
        previous(): Promise<object>;
        /**
         * Moves to the previous page of data.
         */
        previousPage(): Promise<[object]>;
        /**
         * Refetches the contents of the dataset from the collection.
         */
        refresh(): Promise<void>;
        /**
         * Removes the current item.
         */
        remove(): Promise<void>;
        /**
         * Reverts the current item to its saved value.
         */
        revert(): Promise<void>;
        /**
         * Saves the current item.
         */
        save(): Promise<object>;
        /**
         * Sets the current item by index.
         */
        setCurrentItemIndex(index: number): Promise<void>;
        /**
         * Updates the value of a field in the current item.
         */
        setFieldValue(fieldKey: string, value: any): void;
        /**
         * Updates the values of a set of fields in the current item.
         */
        setFieldValues(fieldValues: object): void;
        /**
         * Sets the dataset filter.
         */
        setFilter(filter: wix_data.WixDataFilter): Promise<void>;
        /**
         * Sets the dataset's page size.
         */
        setPageSize(pageSize: number): Promise<void>;
        /**
         * Sets the dataset sort order.
         */
        setSort(sort: wix_data.WixDataSort): Promise<void>;
    }

    namespace Dataset {
        /**
         * An object representing a dataset error.
         */
        type DatasetError = {
            /**
             * Error code.
             */
            code: string;
            /**
             * Error message.
             */
            message: string;
        };

        /**
         * An object used by the \`getItems()\` function that contains the items retrieved and the total number of items in the dataset that match its filter criteria
         */
        type GetItemsResult = {
            /**
             * List of items objects where key:value pairs are the field keys and field values of the retrieved items, including all hidden fields.
             */
            items: [object];
            /**
             * The number of items in the dataset that match its filter criteria.
             */
            totalCount: number;
            /**
             * The index in the dataset of the first item in the items property.
             */
            offset: number;
        };

        /**
         * An after save event handler.
         */
        type AfterSaveHandler = (itemBeforeSave: object, itemAfterSave: object)=>void;

        /**
         * A before save event handler.
         */
        type BeforeSaveHandler = ()=>Promise<boolean>;

        /**
         * A current item index change event handler.
         */
        type CurrentIndexChangedHandler = (index: number)=>void;

        /**
         * An error event handler.
         */
        type ErrorHandler = (operation: string, error: wix_dataset.Dataset.DatasetError)=>void;

        /**
         * A current item value change event handler.
         */
        type ItemValuesChangedHandler = (itemBeforeChange: object, updatedItem: object)=>void;

        /**
         * A dataset ready event handler.
         */
        type ReadyHandler = ()=>void;

    }

}

declare namespace wix_storage {
    /**
     * Used for storing local, session, or memory key/value data in the visitor's browser.
     */
    interface Storage {
        /**
         * Removes **all** items from local, session, or memory storage.
         */
        clear(): void;
        /**
         * Gets an item from local, session, or memory storage.
         */
        getItem(key: string): string;
        /**
         * Removes an item from local, session, or memory storage.
         */
        removeItem(key: string): void;
        /**
         * Stores an item in local, session, or memory storage.
         */
        setItem(key: string, value: string): void;
    }

}

declare namespace wix_users {
    /**
     * A site user.
     */
    interface User {
        /**
         * Gets the user's ID.
         */
        readonly id: string;
        /**
         * Indicates whether the user is logged in or not.
         */
        readonly loggedIn: boolean;
        /**
         * Deprecated: Gets the user's role.
         */
        readonly role: string;
        /**
         * Gets the email of the current user.
         */
        getEmail(): Promise<string>;
        /**
         * Gets the user's member pricing plan.
         */
        getPricingPlans(): Promise<[wix_users.User.PricingPlan]>;
        /**
         * Gets the user's member roles.
         */
        getRoles(): Promise<[wix_users.User.UserRole]>;
    }

    namespace User {
        /**
         * An object returned by the \`getPricingPlans()\` function representing a user's pricing plans.
         */
        type PricingPlan = {
            /**
             * The pricing plan's name.
             */
            name: string;
            /**
             * The pricing plan's start date.
             */
            startDate?: Date;
            /**
             * The pricing plan's expiry date.
             */
            expiryDate?: Date;
        };

        /**
         * An object returned by the \`getRoles()\` function representing a user's roles.
         */
        type UserRole = {
            /**
             * Role name as defined in the site's dashboard or one of \\"Admin\\" or \\"Member\\".
             */
            name: string;
            /**
             * Role description, if defined in the site's dashboard.
             */
            description?: string;
        };

    }

    /**
     * An object used by the \`promptLogin()\` function to determine how the login dialog box appears.
     */
    type LoginOptions = {
        /**
         * What type of login experience to present: \`\\"login\\"\` or \`\\"signup\\"\`. Defaults to the option chosen in the Member Signup Settings panel in the Editor.
         */
        mode?: string;
        /**
         * The two letter language code of the language to show the login form in. Defaults to \`\\"en\\"\` if the property doesn't exist or the given language is not one of the languages found in the Permissions tab of the Page Settings panel in the Editor.
         */
        lang?: string;
    };

    /**
     * An object that contains information about a site registration.
     */
    type RegistrationOptions = {
        /**
         * Contact information.
         */
        contactInfo: wix_crm.ContactInfo;
    };

    /**
     * An object that contains information about the results of a site registration.
     */
    type RegistrationResult = {
        /**
         * Registration status. Either \\"Pending\\" or \\"Active\\".
         */
        status: string;
        /**
         * A token for approving the user as
         *  a site member using the [approveByToken()](wix-users-backend.html#approveByToken)
         *  function. The token is safe to pass via email or from client-side code to
         *  backend code. The token is only available when \`status\` is \\"Pending\\".
         */
        approvalToken?: string;
        /**
         * The user that has been registered.
         */
        user: wix_users.User;
    };

    /**
     * An object used when sending a Triggered Email.
     */
    type TriggeredEmailOptions = {
        /**
         * An object with \`key:value\` pairs where each
         *  \`key\` is a variable in the email template created in Triggered Emails and its
         *  corresponding \`value\` is the value to insert into the template in place of
         *  variable. The values must be strings.
         */
        variables: object;
    };

    /**
     * Function that runs when a user has logged in.
     */
    type LoginHandler = (user: wix_users.User)=>void;

}

declare namespace wix_crm {
    /**
     * An object that contains information about a site contact.
     */
    type ContactInfo = {
        /**
         * Contact's first name.
         */
        firstName: string;
        /**
         * Contact's last name.
         */
        lastName: string;
        /**
         * Contact's image source.
         */
        picture: string;
        /**
         * List of contact's email addresses.
         */
        emails: [string];
        /**
         * Email address the contact who is also
         *  a member uses to log into the system.
         */
        loginEmail: string;
        /**
         * List of contact's phone numbers.
         */
        phones: [string];
        /**
         * List of contact's labels. [Labels](https://support.wix.com/en/article/creating-contact-labels)
         *  are used to organize contacts. When setting the \`labels\` property, you can
         *  only list labels that already exist in your site's [Contacts List](https://support.wix.com/en/article/accessing-your-contact-list).
         */
        labels: [string];
        /**
         * Contact's language.
         */
        language: string;
        /**
         * Any
         *  number of custom fields. [Customs fields](https://support.wix.com/en/article/adding-custom-fields-to-contacts)
         *  are used to store additional information about your site's contacts. When
         *  setting a custom field, use key:value pairs where the key matches the names
         *  defined in your site's [Contacts List](https://support.wix.com/en/article/accessing-your-contact-list).
         *  You can only set values for custom fields that already exist in the Contacts
         *  application.
         */
        customFields: string;
    };

}