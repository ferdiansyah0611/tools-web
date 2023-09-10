---
title: Basic CLI
---

# Basic CLI :robot:

This section will explain about the basic commands in using tools-web

## Basic Command

Help the command.

```bash
--help
```

Get the version of tools-web.

```bash
--version
```

Stop the command.

```bash
0
```

You can run more command on system. Example:

```bash
dir
```

## System Command

This command is related to the system. Such as packages, namespaces, projects and others.

```bash
sys app:active myapp # current project
sys app:root C:/User/Ferdi/Project # namespace
sys app:mode 1 # development/production
sys app:update # upgrading to latest version
sys off name # disable package
sys on name # enable package
sys install name # install package
sys uninstall name # uninstall package
```

## Tools Command

Commonly used commands.

- **Start command**
  ```bash
  tools -h
  ```
- **Run prettier in the current project**
  ```bash
  tools prettier:all
  ```
- **Commit any files & push to repository**
  ```bash
  tools git:automate origin main
  ```