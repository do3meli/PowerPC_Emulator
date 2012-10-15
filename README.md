# Aufgabe "[Mini-Power-PC](http://lords-von-handschreiber.github.com/edu-zhaw-inf-Mini-Power-PC/)"

## Aufgabenbeschreibung
Schreiben Sie ein Programm in einer beliebigen Programmiersprache/Umgebung, das den in der Vorlesung spezifizierten "Mini-Power-PC" emuliert - d.h. alle Befehle des Befehlssatzes (siehe Anlage Befehlssatz "Mini-Power-PC") ausführt.

1. Aufgabe
  * Als Eingabe soll gelesen werden: (2 Punkte)
    * Ein beliebiges mit dem Befehlssatz geschriebenes Programm, das ab Speicher 100 in den Speicher eingelesen wird
    * Die Parameter des Programms (Eingabewerte) ab Speicher 500 (Der Op-Code und die Parameter des Programms können als Binär-, Dezimal- oder Hex-Zahlen eingelesen werden - Ihre Wahl)
  * Als Ausgabe wird folgendes erwartet: (3 + 2 Punkte)
    * Die aktuellen Zustände der Register:
      * Befehlszähler, Befehlsregister
      * Akkumulator, Carry-Bit
      * Reg-1, Reg-2, Reg-3
      * Optional: Alle Werte auch als Binär-Werte (16 Bit)
    * Der aktuelle decodierte Befehl aus dem Befehlsregister (als Mnemonics) (1 Punkt)
    * Der aktuelle Zustand des Speichers:
      * 5 Befehle vor bis 10 Befehle nach dem aktuellen Befehl
      * Der Inhalt der Speicherzellen 500 bis 529 (wortweise)
      * Optional: alle Werte auch als Binär-Werte (16 Bit)
    * Die Anzahl der durchgeführten Befehle (zum Programmstart 0)
  * Implementieren Sie einen "schnellen" und einen "slow" Modus sowie optional einen "Step-Modus": (2 + 2 Punkte)
    * Schneller Modus: Während des Programmablaufs erfolgt keine Ausgabe (keine Aktualisierung der Ausgabedaten); diese werden erst am Programmende aktualisiert
    * Slow-Modus: Während des Programmablaufs wird nach Bearbeitung eines jeden Befehls die Ausgabe aktualisiert
    * Step-Modus: Wie der Slow-Modus, jedoch wird das Programm nach Bearbeitung eines jeden Befehls unterbrochen und wird erst nach einer Bestätigung durch den User (z. B. Drücken einer Taste) wieder fortgesetzt

