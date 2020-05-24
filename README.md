<h1 align="center">Immuni CI Scheduler</h1>

<div align="center">
<img widht="256" height="256" src=".github/logo.png">
</div>

<br />

<div align="center">
    <!-- CoC -->
		<a href="CODE_OF_CONDUCT.md">
      <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" />
    </a>
</div>

<div align="center">
  <h3>
    <a href="https://github.com/immuni-app/documentation">
      Documentation
    </a>
    <span> | </span>    
    <a href="CONTRIBUTING.md">
      Contributing
    </a>
  </h3>
</div>

- [Context](#context)
- [Installation](#installation)
- [Contributing](#contributing)
  - [Contributors](#contributors)
- [License](#license)
  - [Authors / Copyright](#authors--copyright)
  - [Third-party component licenses](#third-party-component-licenses)
    - [Tools](#tools)
    - [Libraries](#libraries)
  - [License details](#license-details)

# Context

This repository contains the source code of Immuni's [iOS](https://github.com/immuni-app/immuni-app-ios) and [Android](https://github.com/immuni-app/immuni-app-android) continuous integration job scheduling system. Its purpose is to verify the integrity of the continuous integration files within submitted PRs, and to run the PR check workflow in such PRs. More detailed information about Immuni can be found in the following documents:

- [High-Level Description](https://github.com/immuni-app/documentation)
- [Product Description](https://github.com/immuni-app/documentation/blob/master/Product%20Description.md)
- [Technology Description](https://github.com/immuni-app/documentation/blob/master/Technology%20Description.md)

# Installation

This repository is not meant to be used as a standalone. On the contrary, it assumes the following:

- It is used as a [Git](https://git-scm.com/) submodule of Immuni's [iOS](https://github.com/immuni-app/app-ios) and [Android](https://github.com/immuni-app/app-android) application repositories
- The folder containing the submodule is named *scheduler*
- The scheduler is run on CircleCI from the master branch of the repository that must be checked, in a workflow called *scheduler*
- The workflow to be run is called *pr\_check*

However, the scheduler component may be installed and run on your system against your own GitHub repositories with CI services provided by CircleCI. Should you wish to do this, the recommended method requires that [Python 3.7](https://www.python.org/downloads/release/python-370/), [pip](https://pypi.org/project/pip/), and [pipenv](https://pypi.org/project/pipenv/) are installed on your system.

```sh
git clone git@github.com:immuni-app/immuni-ci-scheduler.git
cd immuni-ci-scheduler

# This command will install the environment needed to run the project using pipenv.
# Note: this step should be done just once
pipenv install
pipenv run python scheduler.py
```

To leverage the scheduler logic in Immuni's iOS and Android applications, the following is added to their CircleCI configuration file:

```yaml
jobs:
  scheduler:
    docker:
      - image: cimg/python:3.7.7
    resource_class: small
    steps:
      - checkout
      - run:
          name: "[scheduler] Initialize scheduler submodule"
          command: git submodule update --init
      - restore_cache:
          name: "[scheduler] Restore Python Cache"
          keys:
            - pip-packages-v1-{{ .Branch }}-{{ checksum "scheduler/Pipfile.lock" }}
            - pip-packages-v1-{{ .Branch }}-
            - pip-packages-v1-
      - run:
          name: "[scheduler] Install dependencies"
          working_directory: scheduler
          environment:
            PIPENV_NOSPIN: 1
            PIPENV_VENV_IN_PROJECT: 1
          command: |
            pip install pipenv
            pipenv install
      - save_cache:
          name: "[scheduler] Save Python Cache"
          paths:
            - ~/.cache/pip
            - scheduler/.venv
          key: pip-packages-v1-{{ .Branch }}-{{ checksum "scheduler/Pipfile.lock" }}
      - run:
          name: "[scheduler] Configure scheduler"
          command: |
            mv scheduler_config.json scheduler/config.json
      - run:
          name: "[scheduler] Run scheduler"
          working_directory: scheduler
          command: |
            export REPOSITORY="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}"
            pipenv run python scheduler.py

workflows:
  scheduler:
    triggers:
      - schedule:
          cron: "0,15,30,45 * * * *"
          filters:
            branches:
              only:
                - master
    jobs:
      - scheduler:
          context: scheduler
```

In addition, the following runtime environment variables are needed:

- **CIRCLECI\_API\_TOKEN.** This is a personal CircleCI API token allowed to perform API calls to the CircleCI REST API for the repository that must be checked by the scheduler. In Immuni's repos, this is provided by the scheduler CircleCI context.
- **GITHUB\_TOKEN**. This is a GitHub API token with read permissions on the repository that must be checked by the scheduler. In Immuni's repos, this is provided by the scheduler CircleCI context. 
- **REPOSITORY**. This is the repository that must be checked by the scheduler, including the name of the organisation within which said repository is located. In Immuni's repos, this is provided by the Run scheduler step of the scheduler job.

# Contributing

Contributions are most welcome. Before proceeding, please read the [Code of Conduct](CODE_OF_CONDUCT.md) for guidance on how to approach the community and create a positive environment. Additionally, please read our [CONTRIBUTING](CONTRIBUTING.md) file, which contains guidance on ensuring a smooth contribution process.

The Immuni project is composed of different repositories—one for each component or service. Please use this repository for contributions strictly relevant to the Immuni iOS client. To propose a feature request, please open an issue in the [Documentation repository](https://github.com/immuni-app/documentation). This lets everyone involved see it, consider it, and participate in the discussion. Opening an issue or pull request in this repository may slow down the overall process.

## Contributors

Here is a list of Immuni's contributors. Thank you to everyone involved for improving Immuni, day by day.

<a href="https://github.com/immuni-app/immuni-ci-scheduler/graphs/contributors">
  <img
  src="https://contributors-img.web.app/image?repo=immuni-app/immuni-ci-scheduler"
  />
</a>

# License

## Authors / Copyright

Copyright 2020 (c) Commissario straordinario per l'emergenza Covid-19 - Presidenza del Consiglio dei Ministri.
Please check the [AUTHORS](AUTHORS) file for extended reference.

## Third-party component licenses

### Tools

| Name                                          | License |
| ----------------------------------------------| ------- |
| [black](https://pypi.org/project/black/)      | MIT     |
| [Danger](https://github.com/danger/danger-js) | MIT     |
| [mypy](https://pypi.org/project/mypy/)        | MIT     |
| [pip](https://pypi.org/project/pip/)          | MIT     |
| [pipenv](https://pypi.org/project/pipenv/)    | MIT     |

### Libraries

| Name                                                               | License                              |
| ------------------------------------------------------------------ | ------------------------------------ |
| [gitpython](https://pypi.org/project/GitPython/)                   | MIT                                  |
| [importlib-metadata](https://pypi.org/project/importlib-metadata/) | Apache 2.0                           |
| [Markdown](https://pypi.org/project/Markdown/)                     | BSD                                  |
| [mdx_bleach](https://pypi.org/project/mdx_bleach/)                 | MIT                                  |
| [pygithub](https://pypi.org/project/PyGithub/)                     | GNU General Public Licence version 3 |
| [python-decouple](https://pypi.org/project/python-decouple/)       | MIT                                  |
| [requests](https://pypi.org/project/requests/)                     | Apache 2.0                           |

## License details

The licence for this repository is a [GNU Affero General Public Licence version 3](https://www.gnu.org/licenses/agpl-3.0.html) (SPDX: AGPL-3.0). Please see the [LICENCE](LICENSE) file for full reference.
