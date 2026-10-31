def _readme(name, desc, features, deps):
    feats = "\n".join("- " + f for f in features)
    dep_line = ", ".join("`" + d[0] + "`" for d in deps) or "none"
    text = "# " + name + "\n\n"
    text += desc + ".\n\n"
    text += "## Features\n\n" + feats + "\n\n"
    text += "## Installation\n\nRun this command in your terminal:\n\n"
    text += "ezorb install " + name + "\n\n"
    text += "Requires EzOrb Linux 3.0 or newer. Runtime dependencies (" + dep_line + ") are resolved automatically.\n\n"
    text += "## Usage\n\nRun `" + name + " --help` for a full list of commands.\n\n"
    text += "## License\n\nSee the LICENSE file shipped with the package.\n"
    return text