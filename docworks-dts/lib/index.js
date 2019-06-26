"use strict";

import dts from './dts-generator';

export default function runDts(services) {
    return dts(services);
}