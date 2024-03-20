/**
 * The wix-crm-backend module contains functionality for working with
 *  [your site's contacts](https://support.wix.com/en/article/about-your-contact-list)
 *  from backend code.
 */
declare module 'wix-crm-backend' {
    /**
     * The Contacts API is used to manage a site's contacts.
     */
    const contacts: wix_crm_backend.Contacts;

    /**
     * The Notifications API is used to send notifications to the site owner and contributors.
     */
    const notifications: wix_crm_backend.Notifications;

    /**
     * The Tasks API is used to manage a site's tasks.
     */
    const tasks: wix_crm_backend.Tasks;

    /**
     * The Triggered Emails API is used to send triggered emails to your site's contacts and members.
     */
    const triggeredEmails: wix_crm_backend.TriggeredEmails;

    /**
     * The Workflows API is used to manage your site's
     * [workflows](https://support.wix.com/en/article/about-workflows).
     */
    const workflows: wix_crm_backend.Workflows;

    /**
     * **Deprecated.**
     * This function will continue to work, but a newer version is available at
     * [wix-crm-backend.contacts.createContact()](https://www.wix.com/velo/reference/wix-crm-backend/contacts/createcontact).
     */
    function createContact(contactInfo: wix_crm_backend.ContactInfo): Promise<string>;

    /**
     * **Deprecated.**
     * This function will continue to work, but a newer version is available at
     * [wix-crm-backend.contacts.deleteContact()](https://www.wix.com/velo/reference/wix-crm-backend/contacts/deletecontact).
     */
    function deleteContact(contactId: string, options: wix_crm_backend.DeleteOptions): Promise<void>;

    /**
     * **Deprecated.**
     * This function will continue to work, but a newer version is available at
     * [wix-crm-backend.triggeredEmails.emailContact()](https://www.wix.com/velo/reference/wix-crm-backend/triggeredemails/emailcontact).
     */
    function emailContact(emailId: string, toContact: string, options?: wix_crm_backend.TriggeredEmails.TriggeredEmailOptions): Promise<void>;

    /**
     * **Deprecated.**
     * This function will continue to work, but a newer version is available at
     * [wix-crm-backend.contacts.getContact()](https://www.wix.com/velo/reference/wix-crm-backend/contacts/getcontact).
     */
    function getContactById(contactId: string): Promise<wix_crm_backend.ContactInfo>;

    /**
     * **Deprecated.**
     * This function will continue to work, but a newer version is available at
     * [wix-crm-backend.contacts.updateContact()](https://www.wix.com/velo/reference/wix-crm-backend/contacts/updatecontact).
     */
    function updateContact(contactId: string, contactInfo: wix_crm_backend.ContactInfo): Promise<void>;

}

declare namespace wix_crm_backend.Contacts {
    /**
     * Contains functionality for refining a contacts query.
     */
    interface ContactsQueryBuilder {
        /**
         * Adds an `and` condition to the query.
         */
        and(query: wix_crm_backend.Contacts.ContactsQueryBuilder): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Adds a sort to a query, sorting by the specified properties in ascending order.
         */
        ascending(...propertyName: string[]): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value is within a specified range.
         */
        between(propertyName: string, rangeStart: Date, rangeEnd: Date): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Adds a sort to a query, sorting by the specified properties in descending order.
         */
        descending(...propertyName: string[]): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value equals the specified value.
         */
        eq(propertyName: string, value: any): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Returns the items that match the query.
         */
        find(options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.ContactsQueryResult>;
        /**
         * Refines a query to match items whose specified property value is greater than or equal to the specified value.
         */
        ge(propertyName: string, value: Date): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value is greater than the specified value.
         */
        gt(propertyName: string, value: Date): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value contains all of the specified values.
         */
        hasAll(propertyName: string, values: string[]): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value contains any of the specified values.
         */
        hasSome(propertyName: string, values: string[]): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value is less than or equal to the specified value.
         */
        le(propertyName: string, value: Date): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Limits the number of items the query returns.
         */
        limit(limit: string): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value is less than the specified value.
         */
        lt(propertyName: string, value: Date): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value does not equal the specified value.
         */
        ne(propertyName: string, value: any): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Adds an `not` condition to the query.
         */
        not(query: wix_crm_backend.Contacts.ContactsQueryBuilder): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Adds an `or` condition to the query.
         */
        or(query: wix_crm_backend.Contacts.ContactsQueryBuilder): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Sets the number of items to skip before returning query results.
         */
        skip(skip: string): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Refines a query to match items whose specified property value starts with a specified string.
         */
        startsWith(propertyName: string, value: string): wix_crm_backend.Contacts.ContactsQueryBuilder;
    }

    /**
     * The results of a contacts query, containing the retrieved items.
     */
    interface ContactsQueryResult {
        /**
         * Returns the items that match the query.
         */
        readonly items: wix_crm_backend.Contacts.Contact[];
        /**
         * Returns the number of items in the current results page.
         */
        readonly length: number;
        /**
         * Returns the query page size.
         */
        readonly pageSize: number;
        /**
         * Returns the `ContactsQueryBuilder` object used to get the current results.
         */
        readonly query: wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Indicates if the query has more results.
         */
        hasNext(): boolean;
        /**
         * Indicates if the query has previous results.
         */
        hasPrev(): boolean;
        /**
         * Retrieves the next page of query results.
         */
        next(): Promise<wix_crm_backend.Contacts.ContactsQueryResult>;
        /**
         * Retrieves the previous page of query results.
         */
        prev(): Promise<wix_crm_backend.Contacts.ContactsQueryResult>;
    }

    /**
     * Contains functionality for refining an extended fields query.
     */
    interface ExtendedFieldsQueryBuilder {
        /**
         * Adds a sort to a query, sorting by the specified properties in ascending order.
         */
        ascending(...propertyName: string[]): wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
        /**
         * Adds a sort to a query, sorting by the specified properties in descending order.
         */
        descending(...propertyName: string[]): wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
        /**
         * Returns the items that match the query.
         */
        find(options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.ExtendedFieldsQueryResult>;
        /**
         * Limits the number of items the query returns.
         */
        limit(limit: string): wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
        /**
         * Sets the number of items to skip before returning query results.
         */
        skip(skip: string): wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
    }

    /**
     * The results of a contacts query, containing the retrieved items.
     */
    interface ExtendedFieldsQueryResult {
        /**
         * Returns the items that match the query.
         */
        readonly items: wix_crm_backend.Contacts.ExtendedField[];
        /**
         * Returns the number of items in the current results page.
         */
        readonly length: number;
        /**
         * Returns the query page size.
         */
        readonly pageSize: number;
        /**
         * Returns the `ExtendedFieldsQueryBuilder` object used to get the current results.
         */
        readonly query: wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
        /**
         * Indicates if the query has more results.
         */
        hasNext(): boolean;
        /**
         * Indicates if the query has previous results.
         */
        hasPrev(): boolean;
        /**
         * Retrieves the next page of query results.
         */
        next(): Promise<wix_crm_backend.Contacts.ExtendedFieldsQueryResult>;
        /**
         * Retrieves the previous page of query results.
         */
        prev(): Promise<wix_crm_backend.Contacts.ExtendedFieldsQueryResult>;
    }

    /**
     * Contains functionality for refining a labels query.
     */
    interface LabelsQueryBuilder {
        /**
         * Adds a sort to a query, sorting by the specified properties in ascending order.
         */
        ascending(...propertyName: string[]): wix_crm_backend.Contacts.LabelsQueryBuilder;
        /**
         * Adds a sort to a query, sorting by the specified properties in descending order.
         */
        descending(...propertyName: string[]): wix_crm_backend.Contacts.LabelsQueryBuilder;
        /**
         * Returns the items that match the query.
         */
        find(options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.LabelsQueryResult>;
        /**
         * Limits the number of items the query returns.
         */
        limit(limit: string): wix_crm_backend.Contacts.LabelsQueryBuilder;
        /**
         * Sets the number of items to skip before returning query results.
         */
        skip(skip: string): wix_crm_backend.Contacts.LabelsQueryBuilder;
    }

    /**
     * The results of a contacts query, containing the retrieved items.
     */
    interface LabelsQueryResult {
        /**
         * Returns the items that match the query.
         */
        readonly items: wix_crm_backend.Contacts.Label[];
        /**
         * Returns the number of items in the current results page.
         */
        readonly length: number;
        /**
         * Returns the query page size.
         */
        readonly pageSize: number;
        /**
         * Returns the `LabelsQueryBuilder` object used to get the current results.
         */
        readonly query: wix_crm_backend.Contacts.LabelsQueryBuilder;
        /**
         * Indicates if the query has more results.
         */
        hasNext(): boolean;
        /**
         * Indicates if the query has previous results.
         */
        hasPrev(): boolean;
        /**
         * Retrieves the next page of query results.
         */
        next(): Promise<wix_crm_backend.Contacts.LabelsQueryResult>;
        /**
         * Retrieves the previous page of query results.
         */
        prev(): Promise<wix_crm_backend.Contacts.LabelsQueryResult>;
    }

}

declare namespace wix_crm_backend {
    /**
     * The Contacts API is used to manage a site's contacts.
     */
    interface Contacts {
        /**
         * Appends `contactInfo` to an existing contact or creates a new contact if it doesn't already exist.
         */
        appendOrCreateContact(contactInfo: wix_crm_backend.Contacts.ContactInfo): Promise<wix_crm_backend.Contacts.ContactIdentification>;
        /**
         * Creates a new contact.
         */
        createContact(contactInfo: wix_crm_backend.Contacts.ContactInfo, options?: wix_crm_backend.Contacts.Options): Promise<wix_crm_backend.Contacts.Contact>;
        /**
         * Deletes a contact who is not a site member or contributor.
         */
        deleteContact(contactId: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<void>;
        /**
         * Deletes an extended field.
         */
        deleteExtendedField(key: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<void>;
        /**
         * Deletes a label from the site and removes it from contacts it applies to.
         */
        deleteLabel(key: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<void>;
        /**
         * Retrieves a custom field with a given name, or creates one if it doesn't exist.
         */
        findOrCreateExtendedField(extendedFieldInfo: wix_crm_backend.Contacts.ExtendedFieldInfo, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.FoundOrCreatedExtendedField>;
        /**
         * Retrieves a label with a given name, or creates one if it doesn't exist.
         */
        findOrCreateLabel(displayName: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.FoundOrCreatedLabel>;
        /**
         * Retrieves a contact.
         */
        getContact(contactId: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.Contact>;
        /**
         * Retrieves an extended field.
         */
        getExtendedField(key: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.ExtendedField>;
        /**
         * Retrieves a label.
         */
        getLabel(key: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.Label>;
        /**
         * Adds labels to a contact.
         */
        labelContact(contactId: string, labelKeys: string[], options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.Contact>;
        /**
         * Creates a query to retrieve a list of contacts.
         */
        queryContacts(): wix_crm_backend.Contacts.ContactsQueryBuilder;
        /**
         * Creates a query to retrieve a list of extended fields.
         */
        queryExtendedFields(): wix_crm_backend.Contacts.ExtendedFieldsQueryBuilder;
        /**
         * Creates a query to retrieve a list of labels.
         */
        queryLabels(): wix_crm_backend.Contacts.LabelsQueryBuilder;
        /**
         *  Renames an extended field.
         */
        renameExtendedField(key: string, displayName: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.ExtendedField>;
        /**
         *  Renames a label.
         */
        renameLabel(key: string, displayName: string, options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.Label>;
        /**
         * Removes labels from a contact.
         */
        unlabelContact(contactId: string, labelKeys: string[], options?: wix_crm_backend.Contacts.AuthOptions): Promise<wix_crm_backend.Contacts.Contact>;
        /**
         * Updates a contact's properties.
         */
        updateContact(identifiers: wix_crm_backend.Contacts.Identifiers, contactInfo: wix_crm_backend.Contacts.ContactInfo, options?: wix_crm_backend.Contacts.Options): Promise<wix_crm_backend.Contacts.Contact>;
    }

    namespace Contacts {
        type Address = {
            /**
             * Street address ID.
             */
            _id: string;
            /**
             * 
             * 
             * 
             * Address type.
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"HOME"`
             * - `"WORK"`
             * - `"BILLING"`
             * - `"SHIPPING"`
             * 
             */
            tag: string;
            /**
             * Street address.
             */
            address: wix_crm_backend.Contacts.AddressDetails;
        };

        /**
         * Street address.
         */
        type AddressDetails = {
            /**
             * Main address line, usually street and number, as free text.
             */
            addressLine1?: string;
            /**
             * Street address object, with number and name in separate fields.
             */
            streetAddress?: wix_crm_backend.Contacts.StreetAddressInfo;
            /**
             * Human-readable address string.
             *  If not provided, the value is generated from the available address data.
             */
            formatted?: string;
            /**
             * Free text providing more detailed address information,
             *  such as apartment, suite, or floor.
             */
            addressLine2?: string;
            /**
             * Coordinates of the physical address.
             */
            location?: wix_crm_backend.Contacts.AddressLocation;
            /**
             * City name.
             */
            city?: string;
            /**
             * Code for a subdivision (such as state, prefecture, or province) in an
             *  [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) format.
             */
            subdivision?: string;
            /**
             * 2-letter country code in an
             *  [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format.
             */
            country?: string;
            /**
             * Postal or zip code.
             */
            postalCode?: string;
        };

        type AddressInfo = {
            /**
             * 
             * 
             * 
             * Address type.
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"HOME"`
             * - `"WORK"`
             * - `"BILLING"`
             * - `"SHIPPING"`
             * 
             */
            tag: string;
            /**
             * Street address.
             */
            address: wix_crm_backend.Contacts.AddressDetails;
        };

        /**
         * Coordinates of the physical address.
         */
        type AddressLocation = {
            /**
             * Address's latitude.
             */
            latitude?: number;
            /**
             * Address's longitude.
             */
            longitude?: number;
        };

        /**
         * Authorization options.
         */
        type AuthOptions = {
            /**
             * When `true`, prevents permission checks from running for the operation. Defaults to `false`.
             */
            suppressAuth?: boolean;
        };

        /**
         * Contact.
         */
        type Contact = {
            /**
             * Contact ID.
             */
            _id: string;
            /**
             * Revision number, which increments by 1 each time the contact is updated.
             *  To prevent conflicting changes,
             *  the existing `revision` must be used when updating a contact.
             */
            revision: number;
            /**
             * Details about the contact's source.
             */
            source: wix_crm_backend.Contacts.Source;
            /**
             * Date and time the contact was created.
             */
            _createdDate: Date;
            /**
             * Date and time the contact was last updated.
             */
            _updatedDate: Date;
            /**
             * Details about the contact's last action in the site.
             */
            lastActivity: wix_crm_backend.Contacts.LastActivity;
            /**
             * Contact's primary phone and email.
             */
            primaryInfo?: wix_crm_backend.Contacts.PrimaryInfo;
            /**
             * Contact's details.
             */
            info: wix_crm_backend.Contacts.Info;
        };

        type ContactIdentification = {
            /**
             * ID of the contact that was found or created.
             */
            contactId: string;
            /**
             * Identity type of the returned contact.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"CONTACT"`: The returned contact ID belongs to a new or existing contact.
             * - `"MEMBER"`: The returned contact ID belongs to the currently logged-in site member.
             * - `"NOT_AUTHENTICATED_MEMBER"`: The returned contact ID belongs to a site member who is not currently logged in.
             * 
             */
            identityType: string;
        };

        /**
         * Contact's information.
         */
        type ContactInfo = {
            /**
             * Contact's first and last name.
             */
            name?: wix_crm_backend.Contacts.Name;
            /**
             * Contact's company name.
             */
            company?: string;
            /**
             * Contact's job title.
             *  Corresponds to the **Position** field in the Dashboard.
             */
            jobTitle?: string;
            /**
             * Contact's locale, formatted as an
             *  [IETF BCP 47 language tag](https://tools.ietf.org/html/rfc5646).
             *  Typically, this is a lowercase 2-letter language code,
             *  followed by a hyphen,
             *  followed by an uppercase 2-letter country code.
             * 
             *  For example, German from Germany is formatted as `de-DE`,
             *  and U.S. English is formatted as `en-US`.
             */
            locale?: string;
            /**
             * Contact's birthdate, formatted as `"YYYY-MM-DD"`.
             * 
             *  Example: `"2020-03-15"` for March 15, 2020.
             */
            birthdate?: string;
            /**
             * **Deprecated.** Use `profilePicture` instead.
             */
            picture?: wix_crm_backend.Contacts.Picture;
            /**
             * List of up to 50 email addresses.
             */
            emails?: wix_crm_backend.Contacts.EmailInfo[];
            /**
             * List of up to 50 phone numbers.
             */
            phones?: wix_crm_backend.Contacts.PhoneInfo[];
            /**
             * List of up to 50 addresses.
             */
            addresses?: wix_crm_backend.Contacts.AddressInfo[];
            /**
             * List of contact label keys.
             * [Contact labels](https://support.wix.com/en/article/adding-labels-to-contacts-in-your-contact-list)
             * help categorize contacts.
             * 
             * 
             * 
             * 
             * Label keys must exist to be added to the contact.
             * Contact labels can be created or retrieved with
             * [`findOrCreateLabel()`](wix-crm-backend/contacts/findorcreatelabel)
             * or
             * [`queryLabels()`](wix-crm-backend/contacts/queryLabels).
             * 
             */
            labelKeys?: string[];
            /**
             * Set of key-value pairs.
             * 
             * 
             * 
             * Contact's
             * [extended fields](https://www.wix.com/velo/reference/wix-crm-v2/extendedfields/introduction),
             * which allow you to store additional information about your contacts.
             * 
             * To view or create extended fields, use
             * [`findOrCreateExtendedField()`](wix-crm-backend/contacts/findorcreateextendedfield),
             * [`getExtendedField()`](wix-crm-backend/contacts/getextendedfield), or
             * [`queryExtendedFields()`](wix-crm-backend/contacts/queryextendedfields).
             * 
             */
            extendedFields?: any;
            /**
             * Contact's profile picture URL.
             */
            profilePicture?: string;
        };

        /**
         * Contact's profile picture.
         */
        type ContactPicture = {
            /**
             * Image source. Can be either a Media Manager URL or external URL.
             */
            image: string;
            /**
             * Indicates whether the image is retrieved from Wix Media
             * or an external provider.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"EXTERNAL"`: The image is retrieved from an external provider.
             * - `"WIX_MEDIA"`: The image is retrieved from Wix Media.
             * 
             */
            imageProvider: string;
        };

        type Email = {
            /**
             * Email ID.
             */
            _id: string;
            /**
             * Email type.
             * 
             * 
             * 
             * 
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"MAIN"`
             * - `"HOME"`
             * - `"WORK"`
             * 
             */
            tag: string;
            /**
             * Email address.
             */
            email: string;
            /**
             * Indicates whether this is the contact's primary email address.
             *  When changing `primary` to `true` for an email,
             *  the contact's other emails become `false`.
             */
            primary: boolean;
        };

        type EmailInfo = {
            /**
             * Email type.
             * 
             * 
             * 
             * 
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"MAIN"`
             * - `"HOME"`
             * - `"WORK"`
             * 
             */
            tag?: string;
            /**
             * Email address.
             */
            email?: string;
            /**
             * Indicates whether this is the contact's primary email address.
             *  When changing `primary` to `true` for an email,
             *  the contact's other emails become `false`.
             */
            primary?: boolean;
        };

        /**
         * Extended field that was found or created.
         */
        type ExtendedField = {
            /**
             * Extended field ID.
             * 
             * When accessing contact data,
             * extended field data is available at `extendedFields[key]`.
             * For example, if the key is "custom.notes",
             * the value can be accessed at `extendedFields["custom.notes"]`.
             * 
             * `key` is generated when the extended field is created
             * and cannot be modified, even if `displayName` changes.
             */
            key: string;
            /**
             * Extended field display name shown in the Contact List.
             */
            displayName: string;
            /**
             * Type of data the field holds.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"TEXT"`: Accepts strings.
             * - `"URL"`: Accepts web addresses. Prepends `https://` if no protocol is included.
             * - `"DATE"`: Accepts dates formatted as `"YYYY-MM-DD"`.
             * - `"NUMBER"`: Accepts floats.
             * 
             */
            dataType: string;
            /**
             * 
             * 
             * 
             * Indicates whether the extended field is a
             * [system field or custom field](wix-crm-backend/contacts/introduction#about-extended-fields).
             * 
             * One of:
             * 
             * - `"SYSTEM"`: The field is a system field managed by Wix. System fields cannot be modified by 3rd-party apps or site contributors.
             * - `"USER_DEFINED"`: The field is a custom field and can be modified by 3rd-party apps or site contributors.
             * 
             */
            fieldType: string;
            /**
             * Date and time the field was created.
             */
            _createdDate: Date;
            /**
             * Date and time the field was last updated.
             */
            _updatedDate: Date;
            /**
             * 
             * 
             * 
             * Extended field [namespace](wix-crm-backend/contacts/introduction#the-namespace-and-key-properties-in-labels-and-extended-fields).
             * 
             * 
             * Extended fields created by site contributors or 3rd-party apps
             * are automatically assigned to the `custom` namespace.
             */
            namespace: string;
            /**
             * Field description, if the field is a system field.
             */
            description: string;
        };

        /**
         * Custom field to find or create.
         */
        type ExtendedFieldInfo = {
            /**
             * Display name to find or create.
             * 
             *  If an existing custom field is an exact match
             *  for the specified `displayName`,
             *  the existing field is returned.
             *  If not, a new field is created and returned.
             */
            displayName: string;
            /**
             * Type of data the field holds.
             * Ignored if an existing field is an exact match
             * for the specified display name.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"TEXT"`: Accepts strings.
             * - `"URL"`: Accepts web addresses. Prepends `https://` if no protocol is included.
             * - `"DATE"`: Accepts dates formatted as `"YYYY-MM-DD"`.
             * - `"NUMBER"`: Accepts floats.
             * 
             */
            dataType?: string;
        };

        /**
         * List of extended fields.
         */
        type ExtendedFieldList = {
            /**
             * List of extended fields.
             */
            items: wix_crm_backend.Contacts.ExtendedField[];
            /**
             * Metadata for the page of results.
             */
            pagingMetadata: wix_crm_backend.Contacts.PagingMetadata;
        };

        /**
         * Extended field that was found or created.
         */
        type FoundOrCreatedExtendedField = {
            /**
             * Extended field that was found or created.
             */
            extendedField: wix_crm_backend.Contacts.ExtendedField;
            /**
             * Indicates whether the extended field was just created or already existed.
             * 
             *  If the field was just created, returns `true`.
             *  If it already existed, returns `false`.
             */
            newExtendedField: boolean;
        };

        /**
         * Label that was found or created.
         */
        type FoundOrCreatedLabel = {
            /**
             * Label that was found or created.
             */
            label: wix_crm_backend.Contacts.Label;
            /**
             * Indicates whether the label was just created or already existed.
             * 
             *  If the label was just created, returns `true`.
             *  If it already existed, returns `false`.
             */
            newLabel: boolean;
        };

        type Identifiers = {
            /**
             * ID of the contact to update.
             */
            contactId: string;
            /**
             * Revision number.
             *  When updating, include the existing `revision`
             *  to prevent conflicting updates.
             */
            revision: number;
        };

        /**
         * Contact's details.
         */
        type Info = {
            /**
             * Contact's first and last name.
             */
            name?: wix_crm_backend.Contacts.Name;
            /**
             * Contact's company name.
             */
            company?: string;
            /**
             * Contact's job title.
             *  Corresponds to the **Position** field in the Dashboard.
             */
            jobTitle?: string;
            /**
             * Contact's locale, formatted as an
             *  [IETF BCP 47 language tag](https://tools.ietf.org/html/rfc5646).
             *  Typically, this is a lowercase 2-letter language code,
             *  followed by a hyphen,
             *  followed by an uppercase 2-letter country code.
             * 
             *  For example, German from Germany is formatted as `de-DE`,
             *  and U.S. English is formatted as `en-US`.
             */
            locale?: string;
            /**
             * Contact's birthdate, formatted as `"YYYY-MM-DD"`.
             * 
             *  Example: `"2020-03-15"` for March 15, 2020.
             */
            birthdate?: string;
            /**
             * **Deprecated.** Use `profilePicture` instead.
             */
            picture: wix_crm_backend.Contacts.Picture;
            /**
             * List of up to 50 email addresses.
             */
            emails?: wix_crm_backend.Contacts.Email[];
            /**
             * List of up to 50 phone numbers.
             */
            phones?: wix_crm_backend.Contacts.Phone[];
            /**
             * List of up to 50 addresses.
             */
            addresses?: wix_crm_backend.Contacts.Address[];
            /**
             * List of contact label keys.
             * [Contact labels](https://support.wix.com/en/article/adding-labels-to-contacts-in-your-contact-list)
             * help categorize contacts.
             * 
             * 
             * 
             * 
             * Label keys must exist to be added to the contact.
             * Contact labels can be created or retrieved with
             * [`findOrCreateLabel()`](wix-crm-backend/contacts/findorcreatelabel)
             * or
             * [`queryLabels()`](wix-crm-backend/contacts/queryLabels).
             * 
             */
            labelKeys?: string[];
            /**
             * Set of key-value pairs.
             * 
             * 
             * 
             * Contact's
             * [extended fields](https://www.wix.com/velo/reference/wix-crm-v2/extendedfields/introduction),
             * which allow you to store additional information about your contacts.
             * 
             * To view or create extended fields, use
             * [`findOrCreateExtendedField()`](wix-crm-backend/contacts/findorcreateextendedfield),
             * [`getExtendedField()`](wix-crm-backend/contacts/getextendedfield), or
             * [`queryExtendedFields()`](wix-crm-backend/contacts/queryextendedfields).
             * 
             */
            extendedFields: any;
            /**
             * Contact's profile picture URL.
             */
            profilePicture?: string;
        };

        /**
         * Label that was found or created.
         */
        type Label = {
            /**
             * Label key.
             * 
             * `key` is generated when the label is created
             * and cannot be modified, even if `displayName` changes.
             */
            key: string;
            /**
             * Label display name shown in the Dashboard.
             */
            displayName: string;
            /**
             * Label type.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"SYSTEM"`: The label is a predefined system label for the Contact List.
             * - `"USER_DEFINED"`: The label was created by a site contributor or app.
             * - `"WIX_APP_DEFINED"`: The label was created by a Wix app.
             * 
             */
            labelType: string;
            /**
             * Date and time the label was created.
             */
            _createdDate: Date;
            /**
             * Date and time the label was last updated.
             */
            _updatedDate: Date;
            /**
             * 
             * 
             * 
             * Label [namespace](wix-crm-backend/contacts/introduction#the-namespace-and-key-properties-in-labels-and-extended-fields).
             * 
             * 
             * Labels created by site contributors or 3rd-party apps
             * are automatically assigned to the `custom` namespace.
             */
            namespace: string;
        };

        /**
         * List of labels.
         */
        type LabelList = {
            /**
             * List of labels.
             */
            items: wix_crm_backend.Contacts.Label[];
            /**
             * Metadata for the page of results.
             */
            pagingMetadata: wix_crm_backend.Contacts.PagingMetadata;
        };

        /**
         * Details about the contact's last action in the site.
         */
        type LastActivity = {
            /**
             * Date and time of the last action.
             */
            activityDate: Date;
            /**
             * Contact's last action in the site.
             * 
             * 
             * 
             * 
             * Some possible values:
             * `"GENERAL"`, `"CONTACT_CREATED"`, `"MEMBER_LOGIN"`, `"MEMBER_REGISTER"`,
             * `"MEMBER_STATUS_CHANGED"`, `"FORM_SUBMITTED"`, `"INBOX_FORM_SUBMITTED"`,
             * `"INBOX_PAYMENT_REQUEST_PAID"`, `"INBOX_MESSAGE_TO_CUSTOMER"`,
             * `"INBOX_MESSAGE_FROM_CUSTOMER"`, `"NEWSLETTER_SUBSCRIPTION_FORM_SUBMITTED"`,
             * `"NEWSLETTER_SUBSCRIPTION_UNSUBSCRIBE"`, `"ECOM_PURCHASE"`,
             * `"ECOM_CART_ABANDON"`, `"ECOM_CHECKOUT_BUYER"`, `"BOOKINGS_APPOINTMENT"`,
             * `"HOTELS_RESERVATION"`, `"HOTELS_PURCHASE"`, `"HOTELS_CONFIRMATION"`,
             * `"HOTELS_CANCEL"`, `"VIDEO_PURCHASE"`, `"VIDEO_RENT"`,
             * `"CASHIER_BUTTON_PURCHASE"`, `"ARENA_NEW_LEAD"`, `"EVENTS_RSVP"`,
             * `"INVOICE_PAY"`, `"INVOICE_OVERDUE"`, `"PRICE_QUOTE_ACCEPT"`,
             * `"PRICE_QUOTE_EXPIRE"`, `"RESTAURANTS_ORDER"`, `"RESTAURANTS_RESERVATION"`,
             * `"SHOUTOUT_OPEN"`, `"SHOUTOUT_CLICK"`, `"CONTACT_MERGED"`.
             * 
             */
            activityType: string;
        };

        /**
         * Paging options.
         */
        type ListOptions = {
            /**
             * Number of items to return.
             * 
             *  Defaults to `100`.
             */
            limit?: number;
            /**
             * Number of items to skip in the current sort order.
             * 
             *  Defaults to `0`.
             */
            skip?: number;
            /**
             * Sorting options.
             */
            sort?: wix_crm_backend.Contacts.SortingOptions;
            /**
             * When `true`, prevents permission checks from running for the operation. Defaults to `false`.
             */
            suppressAuth?: boolean;
        };

        /**
         * Contact's first and last name.
         */
        type Name = {
            /**
             * Contact's first name.
             */
            first?: string;
            /**
             * Contact's last name.
             */
            last?: string;
        };

        /**
         * Contact creation options.
         */
        type Options = {
            /**
             * Controls whether the call will succeed
             * if the new contact information contains an email already used by another contact.
             * 
             * If set to `true`,
             * the call will succeed even if an email address is used by another contact.
             * If set to `false`,
             * the call will fail if an email address is used by another contact.
             * 
             * Defaults to `false`.
             */
            allowDuplicates?: boolean;
            /**
             * When `true`, prevents permission checks from running for the operation. Defaults to `false`.
             */
            suppressAuth?: boolean;
        };

        /**
         * Metadata for the page of results.
         */
        type PagingMetadata = {
            /**
             * Number of items returned.
             */
            length: number;
            /**
             * Number of items that matched the query.
             */
            totalCount: number;
            /**
             * Indicates if `total` calculation timed out before the response was sent.
             *  Typically this happens if there is a large set of results.
             */
            tooManyToCount: boolean;
        };

        type Phone = {
            /**
             * Phone ID.
             */
            _id: string;
            /**
             * Phone type.
             * 
             * 
             * 
             * 
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"MAIN"`
             * - `"HOME"`
             * - `"MOBILE"`
             * - `"WORK"`
             * - `"FAX"`
             * 
             */
            tag: string;
            /**
             * [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code.
             */
            countryCode?: string;
            /**
             * Phone number.
             */
            phone: string;
            /**
             * [ITU E.164-formatted](https://www.itu.int/rec/T-REC-E.164/)
             *  phone number.
             *  Automatically generated using `phone` and `countryCode`,
             *  as long as both of those values are valid.
             */
            e164Phone?: string;
            /**
             * Whether this is the contact's primary phone number.
             *  When changing `primary` to `true` for a phone,
             *  the contact's other phones become `false`.
             */
            primary: boolean;
        };

        type PhoneInfo = {
            /**
             * Phone type.
             * 
             * 
             * 
             * 
             * `"UNTAGGED"` is shown as "Other" in the Contact List.
             * 
             * One of:
             * 
             * - `"UNTAGGED"`
             * - `"MAIN"`
             * - `"HOME"`
             * - `"MOBILE"`
             * - `"WORK"`
             * - `"FAX"`
             * 
             */
            tag?: string;
            /**
             * [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code.
             */
            countryCode?: string;
            /**
             * Phone number.
             */
            phone?: string;
            /**
             * Whether this is the contact's primary phone number.
             *  When changing `primary` to `true` for a phone,
             *  the contact's other phones become `false`.
             */
            primary?: boolean;
        };

        /**
         * todo
         */
        type Picture = {
            /**
             * **Deprecated.** Use `profilePicture` instead.
             */
            image?: string;
            /**
             * **Deprecated.**
             */
            imageProvider?: string;
        };

        /**
         * Contact's primary phone and email.
         */
        type PrimaryInfo = {
            /**
             * Primary email address.
             * 
             * 
             * 
             * 
             * This property reflects the email address in `contactInfo.emails`
             * where `primary` is `true`.
             * 
             */
            email?: string;
            /**
             * Primary phone number.
             * 
             * 
             * 
             * 
             * This property reflects the phone number in `contactInfo.phones`
             * where `primary` is `true`.
             * 
             */
            phone?: string;
        };

        /**
         * The `options` parameter is an optional parameter that can be used when calling the query [`find()`](#find) function.
         */
        type QueryOptions = {
            /**
             * Plain text search for an exact match, up to 100 characters.
             * 
             * Searchable fields:
             * 
             * - `info.name.first`
             * - `info.name.last`
             * - `info.emails.email`
             * - `info.phones.phone`
             */
            search?: string;
            /**
             * When `true`, prevents permission checks from running for the operation.
             * 
             * Defaults to `false`.
             */
            suppressAuth?: boolean;
        };

        /**
         * Sorting options.
         */
        type SortingOptions = {
            /**
             * Name of the field to sort by.
             */
            fieldName?: string;
            /**
             * Sort order.
             * 
             * 
             * 
             * 
             * One of:
             * 
             * - `"ASC"`: Ascending order
             * - `"DESC"`: Descending order
             * 
             * Defaults to `"ASC"`.
             * 
             */
            order?: string;
        };

        /**
         * Details about the contact's source.
         */
        type Source = {
            /**
             * Source type.
             * 
             * 
             * Some possible values:
             * `"OTHER"`, `"ADMIN"`, `"WIX_APP"`, `"IMPORT"`, `"THIRD_PARTY"`,
             * `"WIX_BOOKINGS"`, `"WIX_CHAT"`, `"WIX_EMAIL_MARKETING"`, `"WIX_EVENTS"`,
             * `"WIX_FORMS"`, `"WIX_GROUPS"`, `"WIX_HOTELS"`, `"WIX_MARKET_PLACE"`,
             * `"WIX_MUSIC"`, `"WIX_RESTAURANTS"`, `"WIX_SITE_MEMBERS"`, `"WIX_STORES"`.
             * 
             */
            sourceType: string;
            /**
             * App ID, if the contact was created by an app.
             */
            appId: string;
        };

        /**
         * Street address object, with number and name in separate fields.
         */
        type StreetAddress = {
            /**
             * Street number.
             */
            number: string;
            /**
             * Street name.
             */
            name: string;
        };

        /**
         * Street address object, with number and name in separate fields.
         */
        type StreetAddressInfo = {
            /**
             * Street number.
             */
            number?: string;
            /**
             * Street name.
             */
            name?: string;
        };

    }

    /**
     * Code that has been replaced with newer, forward-compatible functions.
     */
    interface Deprecated {
    }

    /**
     * Events that are fired by actions relating to site contacts.
     */
    interface Events {
        /**
         * **Deprecated.**
         * This event will continue to work until June 30, 2024.
         */
        onCardCreated(event: wix_crm_backend.Events.CardCreatedEvent): void;
        /**
         * **Deprecated.**
         * This event will continue to work until June 30, 2024.
         */
        onCardMoved(event: wix_crm_backend.Events.CardMovedEvent): void;
        /**
         * **Deprecated.**
         * This event will continue to work until June 30, 2024.
         */
        onCardRestored(event: wix_crm_backend.Events.CardRestoredEvent): void;
        /**
         * An event that triggers when a new contact is created.
         */
        onContactCreated(event: wix_crm_backend.Events.ContactCreatedEvent): void;
        /**
         * An event that triggers when a contact is deleted.
         */
        onContactDeleted(event: wix_crm_backend.Events.ContactDeletedEvent): void;
        /**
         * An event that triggers when one or more source contacts are merged into a target contact.
         */
        onContactMerged(event: wix_crm_backend.Events.ContactMergedEvent): void;
        /**
         * An event that triggers when a contact is updated.
         */
        onContactUpdated(event: wix_crm_backend.Events.ContactUpdatedEvent): void;
        /**
         * An event that triggers when a site visitor submits a Wix Form.
         */
        onFormSubmit(event: wix_crm_backend.Events.FormSubmitEvent): void;
    }

    namespace Events {
        /**
         * An object representing a created card.
         */
        type CardCreatedEvent = {
            /**
             * ID of the card's workflow.
             */
            workflowId: string;
            /**
             * Name of the card's workflow.
             */
            workflowName: string;
            /**
             * ID of the card's phase.
             */
            phaseId: string;
            /**
             * Name of the card's phase.
             */
            phaseName: string;
            /**
             * The card that was created.
             */
            card: wix_crm_backend.Workflows.Card;
        };

        /**
         * An object representing a moved card.
         */
        type CardMovedEvent = {
            /**
             * ID of the card's workflow.
             */
            workflowId: string;
            /**
             * Name of the card's workflow.
             */
            workflowName: string;
            /**
             * ID of the card's new phase.
             */
            newPhaseId: string;
            /**
             * Name of the card's new phase.
             */
            newPhaseName: string;
            /**
             * ID of the card's old phase.
             */
            previousPhaseId: string;
            /**
             * Name of the card's old phase.
             */
            previousPhaseName: string;
            /**
             * The card that was moved.
             */
            card: wix_crm_backend.Workflows.Card;
        };

        /**
         * An object representing a moved card.
         */
        type CardRestoredEvent = {
            /**
             * ID of the workflow the card was restored to.
             */
            workflowId: string;
            /**
             * Name of the workflow the card was restored to.
             */
            workflowName: string;
            /**
             * ID of the phase the card was restored to.
             */
            phaseId: string;
            /**
             * Name of the phase the card was restored to.
             */
            phaseName: string;
            /**
             * The card that was restored.
             */
            card: wix_crm_backend.Workflows.Card;
        };

        type ContactCreatedEvent = {
            /**
             * Event metadata.
             */
            metadata: wix_crm_backend.Events.EventMetadata;
            /**
             * Created contact.
             */
            entity: wix_crm_backend.Contacts.Contact;
        };

        type ContactDeletedEvent = {
            /**
             * Event metadata.
             */
            metadata: wix_crm_backend.Events.UpdateAndDeleteMetadata;
        };

        type ContactMergedData = {
            /**
             * IDs of the source contacts.
             */
            sourceContactIds: string[];
            /**
             * ID of the target contact.
             */
            targetContactId: string;
            /**
             * Updated target contact.
             */
            targetContact: wix_crm_backend.Contacts.Contact;
        };

        type ContactMergedEvent = {
            /**
             * Event metadata.
             */
            metadata: wix_crm_backend.Events.EventMetadata;
            /**
             * Information about the source and target contacts.
             */
            data: wix_crm_backend.Events.ContactMergedData;
        };

        type ContactUpdatedEvent = {
            /**
             * Event metadata.
             */
            metadata: wix_crm_backend.Events.UpdateAndDeleteMetadata;
            /**
             * Updated contact.
             */
            entity: wix_crm_backend.Contacts.Contact;
        };

        /**
         * Event metadata.
         */
        type EventMetadata = {
            /**
             * Event ID.
             */
            id: string;
            /**
             * Contact ID associated with the event.
             */
            entityId: string;
            /**
             * Event timestamp.
             */
            eventTime: string;
            /**
             * Whether the event was triggered as a result of a privacy regulation application
             * (for example, [GDPR](https://support.wix.com/en/article/gdpr-frequently-asked-questions)).
             * For advanced users.
             */
            triggeredByAnonymizeRequest?: boolean;
        };

        /**
         * An object representing an attachment to a Wix Form.
         */
        type FormAttachment = {
            /**
             * Name of the attachment.
             */
            name: string;
            /**
             * Type of attachment.
             * One of:
             * 
             * + `"UNDEFINED"`
             * + `"DOCUMENT"`
             * + `"IMAGE"`
             * + `"VIDEO"`
             */
            type: string;
            /**
             * URL of the attachment.
             */
            url: string;
        };

        /**
         * An object representing a Wix Form field.
         */
        type FormField = {
            /**
             * Name of the field.
             */
            fieldName: string;
            /**
             * Value of the field.
             */
            fieldValue: string;
        };

        /**
         * An object representing a Wix Form.
         */
        type FormSubmitEvent = {
            /**
             * Contact ID of the site visitor submitting the Wix Form.
             */
            contactId: string;
            /**
             * Name of the Wix Form.
             */
            formName: string;
            /**
             * Date and time that the Wix Form was submitted.
             */
            submissionTime: Date;
            /**
             * Data submitted in the Wix Form. The object contains key:value pairs where the key is the field name and the value is the contents of the field.
             */
            submissionData: wix_crm_backend.Events.FormField[];
            /**
             * The Wix Form's attachments.
             */
            attachments: wix_crm_backend.Events.FormAttachment[];
        };

        /**
         * Event metadata.
         */
        type UpdateAndDeleteMetadata = {
            /**
             * Event ID.
             */
            id: string;
            /**
             * Contact ID associated with the event.
             */
            entityId: string;
            /**
             * Event timestamp.
             */
            eventTime: string;
            /**
             * If present and set to `"merge"`,
             * indicates the event was triggered by a merge.
             * 
             * See [`onContactMerged()`](#onContactMerged) for information on handling
             * merge events.
             */
            originatedFrom?: string;
            /**
             * Whether the event was triggered as a result of a privacy regulation application
             * (for example, [GDPR](https://support.wix.com/en/article/gdpr-frequently-asked-questions)).
             * For advanced users.
             */
            triggeredByAnonymizeRequest?: boolean;
        };

    }

    /**
     * The Notifications API is used to send notifications to the site owner and contributors.
     */
    interface Notifications {
        /**
         * Sends a notification.
         */
        notify(body: string, channels: string[], options?: wix_crm_backend.Notifications.NotificationOptions): Promise<void>;
    }

    namespace Notifications {
        /**
         * An object containing information about where to navigate when a notification is clicked.
         */
        type ActionTarget = {
            /**
             * URL to navigate to when the `actionTitle` text is clicked.
             */
            url?: string;
        };

        /**
         * An object representing notification options.
         */
        type NotificationOptions = {
            /**
             * Notification title. Only displayed on mobile and browser notifications. Max length: 512 characters.
             */
            title?: string;
            /**
             * Call to action text to be clicked on. When clicked, navigates to the `actionTarget` URL. Max length: 512 characters.
             */
            actionTitle?: string;
            /**
             * Where to navigate to when the `actionTitle` text is clicked.
             */
            actionTarget?: wix_crm_backend.Notifications.ActionTarget;
            /**
             * Contributor that will receive the notifications, based on their assigned roles.
             *  One of:
             * 
             *  + `"All_Contributors"`: All site contributors, including the site owner.
             *  + `"Owner"`: Only the site owner.
             */
            recipients?: wix_crm_backend.Notifications.SiteContributors;
        };

        /**
         * An object containing information about which contributors will receive a notification.
         */
        type SiteContributors = {
            /**
             * Roles to receive the notification.
             * One of:
             * 
             * + `"All_Contributors"`: All site contributors (default).
             * + `"Owner"`: Only the site owner.
             */
            role?: string;
        };

    }

    /**
     * The Tasks API is used to manage a site's tasks.
     */
    interface Tasks {
        /**
         * Sets a task as completed.
         */
        completeTask(taskId: string): Promise<string>;
        /**
         * Creates a new task.
         */
        createTask(taskInfo: wix_crm_backend.Tasks.TaskInfo): Promise<string>;
        /**
         * Gets a task by ID.
         */
        getTask(taskId: string): Promise<wix_crm_backend.Tasks.Task>;
        /**
         * Removes an existing task.
         */
        removeTask(taskId: string): Promise<string>;
        /**
         * Resets a task as not completed.
         */
        resetTask(taskId: string): Promise<string>;
        /**
         * Updates the specified fields of an existing task.
         */
        updateTaskFields(taskId: string, taskInfo: wix_crm_backend.Tasks.TaskInfo): Promise<string>;
    }

    namespace Tasks {
        /**
         * An object representing a task.
         */
        type Task = {
            /**
             * Unique task identifier.
             */
            _id: string;
            /**
             * Task title.
             */
            title: string;
            /**
             * Date the task is due.
             */
            dueDate: Date;
            /**
             * Unique identifier of the site contact
             *  that this task is linked to.
             */
            contactId: string;
            /**
             * Indicates whether the task has been
             *  completed.
             */
            isCompleted: boolean;
            /**
             * Running task version number. Each time an
             *  action is performed on a task its version number is incremented.
             */
            version: number;
            /**
             * Type of the task's creator. `"USER"`
             *  if the task was created using the site's dashboard. `"APP"` if the task was
             *  created using the [`createTask()`](#createTask) function or if it was created
             *  by an app installed on the site.
             */
            creatorType: string;
            /**
             * When `creatorType` is `"USER"`, the unique
             *  identifier of the user that created the task in the dashboard. Otherwise, `userId` is not
             *  present.
             */
            userId?: string;
            /**
             * When `creatorType` is `"APP"`, the unique
             *  identifier of the application that created the task. Otherwise, `applicationId` is not
             *  present.
             */
            applicationId?: string;
        };

        /**
         * An object representing information for creating or updating a task.
         */
        type TaskInfo = {
            /**
             * Task title.
             */
            title?: string;
            /**
             * Date the task is due.
             */
            dueDate?: Date;
            /**
             * Unique identifier of the site contact
             *  that this task is linked to.
             */
            contactId?: string;
        };

    }

    /**
     * The Triggered Emails API is used to send triggered emails to your site's contacts and members.
     */
    interface TriggeredEmails {
        /**
         * Sends a triggered email to a contact, unless that contact is marked as unsubscribed..
         */
        emailContact(emailId: string, contactId: string, options?: wix_crm_backend.TriggeredEmails.TriggeredEmailOptions): Promise<void>;
        /**
         * Sends a triggered email to a site member.
         */
        emailMember(emailId: string, memberId: string, options?: wix_crm_backend.TriggeredEmails.TriggeredEmailOptions): Promise<void>;
    }

    namespace TriggeredEmails {
        type TriggeredEmailOptions = {
            /**
             * An object with `key:value` pairs. Each
             *  `key` is a variable in the email template created in Triggered Emails, and its
             *  corresponding `value` is the value to insert into the template in place of the
             *  variable. The values must be strings.
             * 
             * Example: `{ firstName: 'John', lastName: 'Doe' }`
             */
            variables: any;
        };

    }

    /**
     * **Deprecated.**
     * The Workflows API is being discontinued and will stop working after June 30, 2024.
     */
    interface Workflows {
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        archiveCard(cardId: string): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        createCard(workflowId: string, phaseId: string, card: wix_crm_backend.Workflows.CreateCardRequest, position?: number): Promise<string>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        createPhase(workflowId: string, phaseInfo: wix_crm_backend.Workflows.CreatePhaseRequest, position?: number): Promise<string>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        createWorkflow(workflowInfo: wix_crm_backend.Workflows.CreateWorkflowRequest): Promise<string>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        deleteCard(cardId: string): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        deletePhase(phaseId: string): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        deleteWorkflow(workflowId: string): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        getCard(cardId: string): Promise<wix_crm_backend.Workflows.Card>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        getPhaseInfo(phaseId: string): Promise<wix_crm_backend.Workflows.Phase>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        getWorkflowInfo(workflowId: string): Promise<wix_crm_backend.Workflows.Workflow>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        listCards(workflowId: string, options: wix_crm_backend.Workflows.ListCardOptions): Promise<wix_crm_backend.Workflows.CardList>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        listPhasesInfo(workflowId: string, options?: wix_crm_backend.Workflows.ListOptions): Promise<wix_crm_backend.Workflows.PhaseList>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        listWorkflowsInfo(options?: wix_crm_backend.Workflows.ListOptions): Promise<wix_crm_backend.Workflows.WorkflowList>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        moveCard(cardId: string, options: wix_crm_backend.Workflows.MoveCardOptions): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        movePhase(phaseId: string, options: wix_crm_backend.Workflows.MovePhaseOptions): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        restoreCard(cardId: string, options: wix_crm_backend.Workflows.MoveCardOptions): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        updateCardFields(cardId: string, cardInfo: wix_crm_backend.Workflows.UpdateCardRequest): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        updatePhaseFields(phaseId: string, phaseInfo: wix_crm_backend.Workflows.UpdatePhaseRequest): Promise<void>;
        /**
         * **Deprecated.**
         * This function is being discontinued and will stop working after June 30, 2024.
         */
        updateWorkflowFields(workflowId: string, workflowInfo: wix_crm_backend.Workflows.UpdateWorkflowRequest): Promise<void>;
    }

    namespace Workflows {
        /**
         * An object containing card information.
         */
        type Card = {
            /**
             * Unique card identifier.
             */
            id: string;
            /**
             * Name of the card.
             */
            name?: string;
            /**
             * Source that created the card.
             * 
             *  Some possible values:
             * 
             *  + `"Contacts"`
             *  + `"Velo"`
             *  + `"Inbox"`
             *  + `"Invoices"`
             *  + `"Marketplace"`
             *  + `"Price Quotes"`
             *  + `"Wix Forms"`
             */
            source: string;
            /**
             * ID of the contact associated with the card.
             */
            contactId: string;
            /**
             * Date the card was created.
             */
            createdDate: Date;
            /**
             * Date the card was last updated.
             */
            updatedDate: Date;
            /**
             * ID of the phase which contains the card.
             */
            phaseId: string;
        };

        /**
         * An object containing a list of cards and pagination info.
         */
        type CardList = {
            /**
             * List of cards matching the list options.
             */
            items: wix_crm_backend.Workflows.Card[];
            /**
             * Number of items in the current results page.
             */
            length: number;
            /**
             * Total number of cards in the specified workflow and phase.
             */
            totalCount: number;
            /**
             * Number of items returned per page with the current list options.
             */
            pageSize: number;
            /**
             * Total number of results pages.
             */
            totalPages: number;
            /**
             * Index of the current page. Indices are zero-based.
             */
            currentPage: number;
        };

        type CreateCardRequest = {
            /**
             * Name of the card.
             */
            name?: string;
            /**
             * ID of the contact associated with the card.
             */
            contactId: string;
        };

        type CreatePhaseRequest = {
            /**
             * Name of the phase.
             */
            name: string;
        };

        type CreateWorkflowRequest = {
            /**
             * Name of the workflow.
             */
            name: string;
            /**
             * Workflow description.
             */
            description?: string;
        };

        /**
         * An object contains ListCards request data.
         */
        type ListCardOptions = {
            /**
             * ID of phase to retrieve cards from. If omitted, will retrieve cards from all phases. Not to be used with `fetchOnlyArchived`.
             */
            phaseId?: string;
            /**
             * Whether to retrieve only archived cards. Not to be used with `phaseId`.
             */
            fetchOnlyArchived?: boolean;
            /**
             * Maximum number of cards to retrieve. Defaults to `50`.
             */
            limit?: number;
            /**
             * Number of cards to skip before the retrieved items. Defaults to `0`.
             */
            skip?: number;
            /**
             * Ordering options.
             */
            order?: wix_crm_backend.Workflows.OrderOptions;
        };

        /**
         * An object containing options used when requesting a list of workflows or phases.
         */
        type ListOptions = {
            /**
             * Maximum number of items to retrieve. Defaults to `50` for phases and `100` for workflows.
             */
            limit?: number;
            /**
             * Number of items to skip before the retrieved items. Defaults to `0`.
             */
            skip?: number;
            /**
             * Ordering options.
             */
            order?: wix_crm_backend.Workflows.OrderOptions;
        };

        /**
         * An object containing options used when requesting a list of workflows or phases.
         */
        type ListWorkflowsOptions = {
            /**
             * Maximum number of items to retrieve. Defaults to `50` for phases and `100` for workflows.
             */
            limit?: number;
            /**
             * Number of items to skip before the retrieved items. Defaults to `0`.
             */
            skip?: number;
            /**
             * Ordering options.
             */
            order?: wix_crm_backend.Workflows.OrderOptions;
        };

        /**
         * An object containing information used when moving a card.
         */
        type MoveCardOptions = {
            /**
             * ID of the phase to move the card to. If omitted, the card remains in the same phase.
             */
            newPhaseId?: string;
            /**
             * Position within the phase to move the card to. If omitted, the card is moved to the top of the phase.
             */
            newPosition?: number;
        };

        /**
         * An object containing information used when moving a phase.
         */
        type MovePhaseOptions = {
            /**
             * ID of the workflow to move the phase to.
             */
            workflowId: string;
            /**
             * Position within the workflow to move the phase to.
             */
            newPosition: number;
        };

        /**
         * An object containing sort order options.
         */
        type OrderOptions = {
            /**
             * Field to sort on.
             */
            field?: string;
            /**
             * Order of sort. Either `"asc"` or `"desc"` (defaults to `"asc"`).
             */
            sort?: string;
        };

        /**
         * An object containing phase information.
         */
        type Phase = {
            /**
             * Unique phase identifier.
             */
            id: string;
            /**
             * Name of the phase.
             */
            name: string;
        };

        /**
         * An object containing a list of phases and pagination info.
         */
        type PhaseList = {
            /**
             * List of phases matching the list options.
             */
            items: wix_crm_backend.Workflows.Phase[];
            /**
             * Number of items in the current results page.
             */
            length: number;
            /**
             * Total number of phases in the specified workflow.
             */
            totalCount: number;
            /**
             * Number of items returned per page with the current list options.
             */
            pageSize: number;
            /**
             * Total number of results pages.
             */
            totalPages: number;
            /**
             * Index of the current page. Indices are zero-based.
             */
            currentPage: number;
        };

        type UpdateCardRequest = {
            /**
             * Name of the card.
             */
            name?: string;
            /**
             * Source that created the card.
             * 
             *  Some possible values:
             * 
             *  + `"Contacts"`
             *  + `"Velo"`
             *  + `"Inbox"`
             *  + `"Invoices"`
             *  + `"Marketplace"`
             *  + `"Price Quotes"`
             *  + `"Wix Forms"`
             */
            source: string;
            /**
             * ID of the contact associated with the card.
             */
            contactId: string;
            /**
             * ID of the phase which contains the card.
             */
            phaseId: string;
        };

        type UpdatePhaseRequest = {
            /**
             * Name of the phase.
             */
            name: string;
        };

        type UpdateWorkflowRequest = {
            /**
             * Name of the workflow.
             */
            name?: string;
            /**
             * Workflow description.
             */
            description?: string;
        };

        /**
         * An object representing a workflow.
         */
        type Workflow = {
            /**
             * Workflow information.
             */
            workflowInfo: wix_crm_backend.Workflows.WorkflowInfo;
            /**
             * ID of the win phase.
             */
            winPhaseId: string;
        };

        /**
         * An object containing information about a workflow.
         */
        type WorkflowInfo = {
            /**
             * Unique workflow identifier.
             */
            id: string;
            /**
             * Name of the workflow.
             */
            name: string;
            /**
             * Workflow description.
             */
            description?: string;
            /**
             * Date the workflow was created.
             */
            createdDate?: Date;
        };

        /**
         * An object containing a list of workflows and pagination info.
         */
        type WorkflowList = {
            /**
             * List of workflows matching the list options.
             */
            items: wix_crm_backend.Workflows.WorkflowInfo[];
            /**
             * Number of items in the current results page.
             */
            length: number;
            /**
             * Total number of workflows in the site.
             */
            totalCount: number;
            /**
             * Number of items returned per page with the current list options.
             */
            pageSize: number;
            /**
             * Total number of results pages.
             */
            totalPages: number;
            /**
             * Index of the current page. Indices are zero-based.
             */
            currentPage: number;
        };

    }

    /**
     * An object that contains information about a site contact.
     */
    type ContactInfo = {
        /**
         * Contact's first name.
         */
        firstName?: string;
        /**
         * Contact's last name.
         */
        lastName?: string;
        /**
         * Contact's image source.
         */
        picture?: string;
        /**
         * List of contact's email addresses. When
         *  creating a contact, if no phone number is
         *  provided, at least one email address must be provided.
         */
        emails?: string[];
        /**
         * Email address the contact who is also
         *  a member uses to log into the system.
         */
        loginEmail?: string;
        /**
         * List of contact's phone numbers. When
         *  creating a contact, if no email is
         *  provided, at least one phone number must be provided.
         */
        phones?: string[];
        /**
         * List of contact's labels. [Labels](https://support.wix.com/en/article/creating-contact-labels)
         *  are used to organize contacts. When setting the `labels` property, you can
         *  only list labels that already exist in your site's [Contacts List](https://support.wix.com/en/article/accessing-your-contact-list).
         */
        labels?: string[];
        /**
         * Any
         *  number of custom fields. [Custom fields](https://support.wix.com/en/article/adding-custom-fields-to-contacts)
         *  are used to store additional information about your site's contacts. When
         *  setting a custom field, use key:value pairs, where the key matches the display names
         *  in your site's [Contacts List](https://support.wix.com/en/article/accessing-your-contact-list).
         *  You can only set values for custom fields that already exist in the Contacts
         *  application.
         */
        customFields?: string | number | Date;
    };

    /**
     * An object that contains contact deletion options.
     */
    type DeleteOptions = {
        /**
         * Whether to perform the deletion when the contact is also a member. Defaults to `false`.
         */
        deleteMembers: boolean;
    };

}

