// index.ts
// Copyright (C) 2020 Presidenza del Consiglio dei Ministri.
// Please refer to the AUTHORS file for more information.
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import { fail, message } from "../danger";
import { promisify } from "util";

const exec = promisify(require("child_process").exec);

export default async () => {
  // tslint:disable-next-line:no-console
  console.log("Starting Mypy check...");

  const config = "./ci/danger/mypy/mypy.ini";
  const root = ".";

  const toolVersion = (await exec("mypy --version")).stdout
    .replace("mypy ", "")
    .replace(/\s+/g, " ")
    .trim();

  try {
    await exec("mypy --config-file " + config + " --show-error-codes " + root);

    // tslint:disable-next-line:no-console
    console.log(`Mypy (${toolVersion}) passed.`);

    message(`:white_check_mark: Mypy (${toolVersion}) passed`);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`Mypy (${toolVersion}) failed:`, err);

    fail(
      `Mypy (${toolVersion}) failed: run \`mypy --config-file [configuration] ${root}\` to check errors. \
      Please check local or [default configuration](https://github.com/immuni-app/immuni-ci-scheduler/blob/master/ci/danger/mypy/mypy.ini).`
    );
    fail(err.stdout);
  }
};
