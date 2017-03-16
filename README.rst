============
rst-snippets
============

This Atom Package is focused on developing some shortcuts for editing reStructuredText
documents.


Tables
======

This is a Atom adaptation of `Vincent Driessen's vim-rst-tables` [1]_ code
by Martín Gaitán <gaitan@gmail.com>

.. [1]: https://github.com/nvie/vim-rst-tables

Usage
-----

1. Set reStructuredText as syntax (or open a .rst)
2. Create some kind of table outline::

      This is paragraph text *before* the table.

      Column 1  Column 2
      Hickory  Insert two (or more) spaces as a field separator.
      Dickory  Long lines like these are fine, as long as you do not put in line endings here.
      Dock  This is the last line.

      This is paragraph text *after* the table.

2. Put your cursor somewhere in the content to convert as table.

3. Press ``ctrl+alt+t enter`` (to create the table).  The output will look something like
   this::

      This is paragraph text *before* the table.

      +----------+---------------------------------------------------------------------------------+
      | Column 1 | Column 2                                                                        |
      +==========+=================================================================================+
      | Hickory  | Insert two (or more) spaces as a field separator.                               |
      +----------+---------------------------------------------------------------------------------+
      | Dickory  | Long lines like these are fine, as long as you do not put in line endings here. |
      +----------+---------------------------------------------------------------------------------+
      | Dock     | This is the last line.                                                          |
      +----------+---------------------------------------------------------------------------------+

      This is paragraph text *after* the table.

4. Suppose you want to wrap long line within a cell. First break the line and place pipes to
  delineate the column. Then press ``ctrl+alt+t t`` (to fix the formatting).

  ::

      This is paragraph text *before* the table.

      +----------+---------------------------------------------------------------------------------+
      | Column 1 | Column 2                                                                        |
      +==========+=================================================================================+
      | Hickory  | Insert two (or more) spaces as a field separator.                               |
      +----------+---------------------------------------------------------------------------------+
      | Dickory  | Long lines like these are fine, as long as you do not
      |  |  put in line endings here. |
      +----------+---------------------------------------------------------------------------------+
      | Dock     | This is the last line.                                                          |
      +----------+---------------------------------------------------------------------------------+

      This is paragraph text *after* the table.

  The output will look something like
  this::

      This is paragraph text *before* the table.

      +----------+-------------------------------------------------------+
      | Column 1 | Column 2                                              |
      +==========+=======================================================+
      | Hickory  | Insert two (or more) spaces as a field separator.     |
      +----------+-------------------------------------------------------+
      | Dickory  | Long lines like these are fine, as long as you do not |
      |          | put in line endings here.                             |
      +----------+-------------------------------------------------------+
      | Dock     | This is the last line.                                |
      +----------+-------------------------------------------------------+

      This is paragraph text *after* the table.

5. If you wanted to add additional content to a cell, but not increase the width of the current
  table. Add your additional text to the line, then press ``ctrl+alt+t r`` to
  reflow and wrap text as needed.::

    This is paragraph text *before* the table.

    +----------+-------------------------------------------------------+
    | Column 1 | Column 2                                              |
    +==========+=======================================================+
    | Hickory  | Insert two (or more) spaces as a field separator.     |
    +----------+-------------------------------------------------------+
    | Dickory  | Long lines like these are fine, as long as you do not |
    |          | put in line endings here.                             |
    +----------+-------------------------------------------------------+
    | Dock     | This is the last line. Fore score and seven years ago, the quick brown fox jumped over the lazy dogs.                               |
    +----------+-------------------------------------------------------+

    This is paragraph text *after* the table.

  The output will look something like
  this::

    This is paragraph text *before* the table.

    +----------+------------------------------------------------------+
    | Column 1 | Column 2                                             |
    +==========+======================================================+
    | Hickory  | Insert two (or more) spaces as a field separator.    |
    +----------+------------------------------------------------------+
    | Dickory  | Long lines like these are fine, as long as you       |
    |          | do not put in line endings here.                     |
    +----------+------------------------------------------------------+
    | Dock     | This is the last line. Fore score and seven          |
    |          | years ago, the quick brown fox jumped over the lazy  |
    |          | dogs.                                                |
    +----------+------------------------------------------------------+

    This is paragraph text *after* the table.

.. tip::

   Change something in the output table and run ``ctrl+alt+t enter`` again: Magically,
   it will be fixed.

   And ``ctrl+alt+t r`` reflows the table maintaining the current column width.
