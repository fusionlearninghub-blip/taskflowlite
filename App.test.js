import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from './App';

describe('Task Flow', () => {
  it('adds and completes a task', async () => {
    const screen = render(<App />);

    const input = await screen.findByPlaceholderText('Add a task');
    fireEvent.changeText(input, 'Ship the APK');
    fireEvent.press(screen.getByLabelText('Add task'));

    expect(screen.getByText('Ship the APK')).toBeTruthy();

    fireEvent.press(screen.getByText('Ship the APK'));

    await waitFor(() => {
      expect(screen.getByText('Done')).toBeTruthy();
    });
  });
});
